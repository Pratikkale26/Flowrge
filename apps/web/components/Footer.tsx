export const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="fixed bottom-0 w-full border-t bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
      <div className="flex justify-center p-4">
        <p className="text-sm text-gray-500 dark:text-white">
          © {year} Flowrge - All rights reserved.
        </p>
      </div>
    </footer>
  );
};
