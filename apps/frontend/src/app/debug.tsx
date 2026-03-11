"use client";

import { useEffect, useState } from "react";

export default function DebugPage() {
  const [apiUrl, setApiUrl] = useState<string>("");
  const [testResult, setTestResult] = useState<string>("");

  useEffect(() => {
    setApiUrl(process.env.NEXT_PUBLIC_API_URL || "Not set");
    
    // Test API connection
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/health`)
      .then(res => res.json())
      .then(data => setTestResult(`Success: ${JSON.stringify(data)}`))
      .catch(err => setTestResult(`Error: ${err.message}`));
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Debug Information</h1>
      
      <div className="space-y-4">
        <div>
          <h2 className="font-semibold">NEXT_PUBLIC_API_URL:</h2>
          <p className="bg-gray-100 p-2 rounded">{apiUrl}</p>
        </div>
        
        <div>
          <h2 className="font-semibold">API Test (/health):</h2>
          <p className="bg-gray-100 p-2 rounded">{testResult}</p>
        </div>
      </div>
    </div>
  );
}
