const API_URL = "https://life-debugger-final.onrender.com/api/health";

const poll = async () => {
    console.log("Polling Render health endpoint...");
    while (true) {
        try {
            const res = await fetch(API_URL);
            if (res.ok) {
                const text = await res.text();
                if (text.includes("hasGeminiKey")) {
                    console.log("Deployed version found! Response:");
                    console.log(text);
                    break;
                }
            }
        } catch (err) {
            console.log("Fetch error, retrying...");
        }
        await new Promise(r => setTimeout(r, 5000));
    }
};

poll();
