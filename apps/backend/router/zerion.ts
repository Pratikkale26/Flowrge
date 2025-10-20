import { Router } from "express";
import { authMiddleware } from "../middlewares/middleware";
import { prisma } from "db/prisma";
import axios from "axios";

export const zerionRouter = Router();

const ZERION_API_KEY = process.env.ZERION_API_KEY;

if (!ZERION_API_KEY) {
  console.warn("ZERION_API_KEY is not set in environment variables");
}

// Helper function to make authenticated requests to Zerion API
const zerionRequest = async (method: 'get' | 'post' | 'delete', endpoint: string, data?: any) => {
  if (!ZERION_API_KEY) {
    throw new Error("Zerion API key is not configured");
  }

  const authHeader = `Basic ${Buffer.from(`${ZERION_API_KEY}:`).toString("base64")}`;
  
  return axios({
    method,
    url: `https://api.zerion.io/v1/${endpoint}`,
    headers: {
      'accept': 'application/json',
      'content-type': 'application/json',
      'authorization': authHeader
    },
    data
  });
};

// Create a new Zerion subscription -> (activate the flow on frontend if solana address is set as trigger)
zerionRouter.post("/subscriptions", authMiddleware, async (req, res) => {
  try {
    const { walletAddress, callbackUrl, chainId = "solana", zapId } = req.body;
    const userId = req.id;

    if (!walletAddress) {
      return res.status(400).json({ error: "Wallet address is required" });
    }

    const response = await zerionRequest('post', 'tx-subscriptions', {
      callback_url: callbackUrl || `${process.env.APP_URL}/catch/1/${zapId}`,
      addresses: [walletAddress],
      chain_ids: [chainId]
    });

    console.log(response.data);

    // Store the subscription in the database
    await prisma.zerionSubscription.create({
      data: {
        subscriptionId: response.data.id,
        userId: Number(userId),
        walletAddress,
        chainId,
        callbackUrl: response.data.attributes.callback_url,
        isActive: true
      }
    });

    res.json({
      success: true,
      data: response.data
    });
  } catch (error: any) {
    console.error("Error creating Zerion subscription:", error);
    res.status(500).json({
      success: false,
      error: error.response?.data?.error || error.message
    });
  }
});


// Get a single subscription by ID
zerionRouter.get("/subscriptions/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.id;

    const subscription = await prisma.zerionSubscription.findFirst({
      where: {
        id,
        userId: Number(userId)
      }
    });

    if (!subscription) {
      return res.status(404).json({
        success: false,
        error: "Subscription not found or access denied"
      });
    }

    // Get the latest status from Zerion
    try {
      const response = await zerionRequest('get', `tx-subscriptions/${subscription.subscriptionId}`);
      // Update our local subscription status
      await prisma.zerionSubscription.update({
        where: { id: subscription.id },
        data: {
          isActive: response.data.attributes.isActive,
          updatedAt: new Date()
        }
      });

      return res.json({
        success: true,
        data: {
          ...subscription,
          isActive: response.data.attributes.isActive
        }
      });
    } catch (error: any) {
      // If we can't reach Zerion, just return the local data
      if (error.response?.status === 404) {
        await prisma.zerionSubscription.update({
          where: { id: subscription.id },
          data: { isActive: false, updatedAt: new Date() }
        });
        return res.json({
          success: true,
          data: { ...subscription, isActive: false }
        });
      }
      throw error;
    }
  } catch (error: any) {
    console.error("Error getting Zerion subscription:", error);
    res.status(500).json({
      success: false,
      error: error.response?.data?.error || error.message
    });
  }
});

// List all subscriptions for the authenticated user
zerionRouter.get("/subscriptions", authMiddleware, async (req, res) => {
  try {
    const userId = req.id;
    const subscriptions = await prisma.zerionSubscription.findMany({
      where: { userId: Number(userId) },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      data: subscriptions
    });
  } catch (error: any) {
    console.error("Error listing Zerion subscriptions:", error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Delete a subscription
zerionRouter.delete("/subscriptions/:subscriptionId", authMiddleware, async (req, res) => {
  try {
    const { subscriptionId } = req.params;
    const userId = req.id;

    // First check if the subscription exists and belongs to the user
    const subscription = await prisma.zerionSubscription.findFirst({
      where: {
        subscriptionId,
        userId: Number(userId)
      }
    });

    if (!subscription) {
      return res.status(404).json({
        success: false,
        error: "Subscription not found or access denied"
      });
    }

    // Delete from Zerion
    const response = await zerionRequest('delete', `tx-subscriptions/${subscriptionId}`);
    
    // Delete from our database
    await prisma.zerionSubscription.delete({
      where: { id: subscription.id }
    });

    res.json({
      success: true,
      message: "Subscription deleted successfully"
    });
  } catch (error: any) {
    console.error("Error deleting Zerion subscription:", error);
    
    // If it's a 404, still delete from our DB as it might already be deleted in Zerion
    if (error.response?.status === 404) {
      try {
        await prisma.zerionSubscription.deleteMany({
          where: { subscriptionId: req.params.subscriptionId }
        });
        return res.json({
          success: true,
          message: "Subscription was already deleted from Zerion, removed from local database"
        });
      } catch (dbError) {
        console.error("Error cleaning up deleted subscription:", dbError);
      }
    }

    res.status(500).json({
      success: false,
      error: error.response?.data?.error || error.message
    });
  }
});


export default zerionRouter;
