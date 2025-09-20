import {
    GoogleGenerativeAI,
    FunctionDeclaration,
    SchemaType,
    FunctionResponsePart,
    FunctionCall, // Import the FunctionCall type for explicit typing
  } from "@google/generative-ai";
  
  // Initialize the Google Generative AI client with your API key
  const genAI = new GoogleGenerativeAI("AIzaSyBgO9W4FUknwDg0DFNBdDxXSKXGTQo_9iI");
  
  // In a real application, this function would connect to your Cloud SQL database.
  async function fetchLegalClauses({ topic }: { topic: string }): Promise<string> {
    console.log(`[Agent Tool]: Mock searching database for topic: ${topic}`);
    // This is a mock database. Replace with your actual database logic.
    const clauseDatabase: { [key: string]: string } = {
      confidentiality:
        "The Receiving Party agrees to hold the Confidential Information in strict confidence and not to disclose it to any third party without the prior written consent of the Disclosing Party.",
      termination:
        "This Agreement may be terminated by either party upon thirty (30) days written notice to the other party.",
      "governing law":
        "This Agreement shall be governed by and construed in accordance with the laws of the State of [Governing Law State].",
      "dispute resolution":
          "Any dispute arising out of or in connection with this Agreement shall be resolved through binding arbitration in accordance with the rules of the [Arbitration Association]. The arbitration shall take place in [City, State], and the language of the arbitration shall be English.",
    };
  
    const lowerTopic = topic.toLowerCase();
    for (const key in clauseDatabase) {
      if (lowerTopic.includes(key)) {
        return clauseDatabase[key];
      }
    }
  
    return `No specific clause was found for "${topic}", but standard legal principles should apply. Consider seeking professional legal advice for this section.`;
  }
  
  // Define the tool for the generative model
  const tools: FunctionDeclaration[] = [
    {
      name: "fetchLegalClauses",
      description: "Searches the legal database for clauses relevant to a given topic or keyword.",
      parameters: {
        type: SchemaType.OBJECT,
        properties: {
          topic: {
            type: SchemaType.STRING,
            description: "The legal topic to search for (e.g., 'Confidentiality', 'Termination', 'Governing Law').",
          },
        },
        required: ["topic"],
      },
    },
  ];
  
  export async function invokeLegalAgent(prompt: string): Promise<string> {
    try {
      console.log("invokeLegalAgent started with new architecture.");
  
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        // CHANGE: Made the system instruction much more direct to prevent model confusion.
        systemInstruction: `You are a legal document drafting AI.
        - Your task is to use the \`fetchLegalClauses\` tool to get text for legal clauses and then assemble a final document in HTML.
        - After you get the text from the tool, you MUST insert it directly into the final HTML.
        - **Crucially, do not describe your actions or the tools in the output.** For example, instead of outputting "<b>[Insert Confidentiality clause...]</b>", you must call the tool and place the text it returns directly into the HTML.
        - Structure the document with \`<h1>\` for the title and \`<h2>\` for numbered section headings.
        - Use \`<p>\` for paragraphs and \`<strong>\` to bold important terms.
        - Your final response MUST be a single, complete HTML string and nothing else.`,
        tools: [{ functionDeclarations: tools }],
      });
  
      // Manually manage the conversation history
      const conversation: { role: string; parts: any[] }[] = [
        { role: "user", parts: [{ text: prompt }] },
      ];
  
      let loopCount = 0;
      const loopLimit = 5; // Failsafe to prevent infinite loops
  
      while (loopCount < loopLimit) {
        loopCount++;
        console.log(`-> Loop ${loopCount}: Sending request to model.`);
  
        const result = await model.generateContent({ contents: conversation });
        const response = result.response;
        
        if (!response) {
          throw new Error("Received an empty response from the model.");
        }
  
        const modelResponseParts = response.candidates?.[0]?.content?.parts;
        if (!modelResponseParts) {
          throw new Error("Model response is missing valid content parts.");
        }
        conversation.push({ role: "model", parts: modelResponseParts });
  
        const functionCalls = response.functionCalls();
        if (functionCalls && functionCalls.length > 0) {
          console.log(`-> Loop ${loopCount}: Model requested ${functionCalls.length} function call(s).`);
          
          const functionCallPromises = functionCalls.map((call: FunctionCall) => {
            if (call.name === "fetchLegalClauses") {
              return fetchLegalClauses(call.args as { topic: string });
            }
            console.warn(`Unknown function was called: ${call.name}`);
            return Promise.resolve(null); 
          });
  
          const toolResults = await Promise.all(functionCallPromises);
          console.log(`-> Loop ${loopCount}: Finished executing tools.`);
  
          const functionResponseParts: FunctionResponsePart[] = functionCalls.map((call: FunctionCall, i: number) => ({
              functionResponse: {
                  name: call.name,
                  response: { content: toolResults[i] || "No result found for this tool call." },
              },
          }));
  
          conversation.push({
            role: "function",
            parts: functionResponseParts,
          });
  
        } else {
          console.log(`-> Loop ${loopCount}: No function calls from model. Breaking loop.`);
          break;
        }
      }
  
      if (loopCount >= loopLimit) {
        throw new Error("The AI agent got stuck in a processing loop and could not complete the request.");
      }
      
      const lastResponse = conversation[conversation.length - 1];
      const finalText = lastResponse.parts.map(part => part.text).join("");
  
      if (!finalText || finalText.trim() === "") {
          throw new Error("The AI assistant failed to generate a final document after using its tools.");
      }
  
      console.log("invokeLegalAgent finished successfully.");
      return finalText;
  
    } catch (error) {
      console.error("An unexpected error occurred in invokeLegalAgent:", error);
      throw error;
    }
  }
  
  