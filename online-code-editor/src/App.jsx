import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { cpp } from "@codemirror/lang-cpp";
import { java } from "@codemirror/lang-java";
import { oneDark } from "@codemirror/theme-one-dark";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import Toastify styles

function App() {
  const { loginWithRedirect, logout, user, isAuthenticated, isLoading } = useAuth0();
  const [code, setCode] = useState("// Write your code here...");
  const [language, setLanguage] = useState("javascript");
  const [output, setOutput] = useState("");
  const [isFullscreen, setFullscreen] = useState(false);

  // Compile code using Piston API (No API key required)
  const compileCode = async () => {
    const languageMap = {
      javascript: "js",
      python: "python3",
      java: "java",
      cpp: "cpp",
    };

    try {
      const response = await axios.post("https://emkc.org/api/v1/piston/execute", {
        language: languageMap[language], // Select language from the languageMap
        source: code, // The code to execute
      });

      if (response.data?.output) {
        setOutput(response.data.output);
      } else {
        setOutput("No output received.");
      }
    } catch (error) {
      console.error("Compilation Error:", error);
      setOutput("Error in compilation. Please check your code or try again.");
    }
  };

  // Function to download the code as a .txt file
  const downloadCode = () => {
    const blob = new Blob([code], { type: "text/plain" });
    const link = document.createElement("a");
    link.download = `code.${language}`;
    link.href = URL.createObjectURL(blob);
    link.click();
  };

  useEffect(() => {
    // Show welcome message when user logs in
    if (isAuthenticated && user) {
      toast.success(`Welcome, ${user.name}!`, {
        position: "top-center", // Position the toast at the top center
        autoClose: 5000, // Auto close after 5 seconds
      });
    }
  }, [isAuthenticated, user]); // Trigger when user logs in

  if (isLoading) return <div>Loading....</div>;

  return (
    <div
      className={`min-h-screen ${isFullscreen ? "fullscreen" : ""} bg-gray-900 text-white`}
    >
      {/* If not authenticated, show the login button */}
      {!isAuthenticated ? (
        <div className="flex justify-center items-center min-h-screen">
          <button
            onClick={() => loginWithRedirect()}
            className="bg-blue-600 px-4 py-2 rounded"
          >
            Log in to access the editor
          </button>
        </div>
      ) : (
        <div>
          {/* Username at the top in neon cursive font */}
          <div className="text-center text-4xl font-cursive neon-text mb-4">
            {user && <span>{`Welcome, ${user.name}`}</span>}
          </div>

          <div className="p-4 flex justify-between items-center flex-wrap gap-4">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-gray-800 p-2 rounded w-full sm:w-auto"
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="cpp">C++</option>
            </select>
            <div className="flex gap-2 flex-wrap">
              <button onClick={compileCode} className="bg-blue-600 px-4 py-2 rounded">
                Run
              </button>
              <button onClick={downloadCode} className="bg-green-600 px-4 py-2 rounded">
                Download
              </button>
              <button
                onClick={() => setFullscreen(!isFullscreen)}
                className="bg-yellow-600 px-4 py-2 rounded"
              >
                {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
              </button>
              <button
                onClick={() => logout({ returnTo: window.location.origin })}
                className="bg-red-600 px-4 py-2 rounded"
              >
                Log Out
              </button>
            </div>
          </div>

          {/* Main content area */}
          <div
            className={`flex flex-col sm:flex-row gap-6 p-4 transition-all duration-300 ${
              isFullscreen ? "h-screen" : ""
            }`}
          >
            {/* Code Editor */}
            <div
              className={`flex ${isFullscreen ? "flex-col h-full" : ""} w-full sm:w-2/3`}
            >
              <CodeMirror
                value={code}
                height={isFullscreen ? "calc(100vh - 120px)" : "400px"}
                theme={oneDark}
                extensions={[
                  language === "javascript"
                    ? javascript()
                    : language === "python"
                    ? python()
                    : language === "java"
                    ? java()
                    : cpp(),
                ]}
                onChange={(value) => setCode(value)}
              />
            </div>

            {/* Output */}
            <div
              className={`bg-gray-800 p-6 rounded w-full sm:w-1/3 ${
                isFullscreen ? "flex-grow mt-4" : "block"
              }`}
            >
              <h3 className="text-lg font-bold mb-2">Output</h3>
              <pre>{output}</pre>
            </div>
          </div>
        </div>
      )}

      {/* Toastify container to display toast notifications */}
      <ToastContainer />
      <center><h2>&copy;Priyanshu Verma</h2></center>
    </div>

    
  );
}

export default App;
