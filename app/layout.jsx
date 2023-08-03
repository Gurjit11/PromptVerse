import Nav from "@components/Nav";
import Provider from "@components/Provider";
import "@styles/globals.css";

export const metadata = {
  title: "PromptVerse",
  description: "Discover & Share AI Prompts",
};

const RootLayout = ({ children }) => {
  return (
    <html>
      <head>
        <link rel="icon" href="/next.svg" />
      </head>
      <body>
        <Provider>
          <div className="main">
            <div className="gradient" />
          </div>

          <main className="app ">
            <Nav />
            {children}
            <div className="flex-center bottom-0 mt-[120px] pb-12 ">
              <span className="bg-gradient-to-r from-red-500 to-purple-600 bg-clip-text text-transparent">
                Made with{" "}
                <span className="bg-red-600 bg-clip-text text-transparent">
                  ❤️
                </span>{" "}
                by Gurjit Singh
              </span>
            </div>
          </main>
        </Provider>
      </body>
    </html>
  );
};

export default RootLayout;
