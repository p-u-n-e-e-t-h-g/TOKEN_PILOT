/**
 * TokenPilot Example Test Scenario
 * 
 * This script demonstrates how to interact with the TokenPilot backend API
 * to test the routing and agent features.
 * 
 * Prerequisite: 
 * 1. Ensure Ollama is running locally with the `qwen2.5:3b` model installed.
 * 2. Ensure the TokenPilot server is running on port 3000 (cd server && npm run dev)
 */

async function runTestScenario() {
  const SERVER_URL = 'http://localhost:3000';

  console.log("🚀 Starting TokenPilot Test Scenario...\n");

  // 1. Check Server Health
  console.log("1️⃣ Checking Server Health...");
  try {
    const healthRes = await fetch(`${SERVER_URL}/health`);
    const healthData = await healthRes.json();
    console.log("   ✅ Health Response:", healthData);
  } catch (error) {
    console.error("   ❌ Failed to connect to server. Is it running on port 3000?");
    return;
  }
  console.log("");

  // 2. Test Chat Routing (Simple Request -> Local Model)
  console.log("2️⃣ Testing Chat Routing (Simple Request)...");
  try {
    const chatRes = await fetch(`${SERVER_URL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: "Write a simple function to add two numbers in JavaScript.",
        files: [],
        context: []
      })
    });
    const chatData = await chatRes.json();
    console.log("   ✅ Routed to Provider:", chatData.provider);
    console.log("   ✅ Selected Model:", chatData.model);
    console.log("   ✅ Response Preview:", chatData.response.substring(0, 100).replace(/\n/g, ' ') + "...");
  } catch (error) {
    console.error("   ❌ Chat request failed:", error);
  }
  console.log("");

  // 3. Test Agent Edit (Code Modification)
  console.log("3️⃣ Testing Agent Edit (Refactoring Request)...");
  const testFile = {
    path: "src/calculator.ts",
    content: "function calc(a,b,op) { if(op==='+') return a+b; if(op==='-') return a-b; }"
  };

  try {
    const editRes = await fetch(`${SERVER_URL}/agent/edit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        command: "Refactor this function to use a switch statement and add typescript types.",
        file: testFile,
        selection: {
          startLine: 0,
          endLine: 0,
          text: testFile.content
        }
      })
    });
    
    if (editRes.status !== 200) {
      console.error("   ❌ Agent edit request failed with status:", editRes.status);
    } else {
      const editData = await editRes.json();
      console.log("   ✅ Edit completed by:", editData.provider, "using model:", editData.model);
      console.log("   ✅ Original Code:\n      ", testFile.content);
      console.log("   ✅ Modified Code:\n      ", editData.modifiedContent.replace(/\n/g, '\n      '));
    }
  } catch (error) {
    console.error("   ❌ Agent edit request failed:", error);
  }
  console.log("\n🎉 Test Scenario Completed!");
}

runTestScenario();
