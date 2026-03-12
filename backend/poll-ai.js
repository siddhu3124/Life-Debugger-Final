const API_URL = "https://life-debugger-final.onrender.com/api";

const pollAi = async () => {
    console.log("Registering and polling...");
    const timestamp = Date.now();
    const email = `testpoll${timestamp}@example.com`;
    const password = "password123";

    await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "Poll Test", email, password })
    });

    const loginRes = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });
    const token = (await loginRes.json()).token;

    while (true) {
        console.log("Testing AI endpoint...");
        const probRes = await fetch(`${API_URL}/problems/add`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ problem: "Test polling", category: "Test" })
        });

        const data = await probRes.text();
        if (!data.includes("Failed to analyze problem\"}")) {
            console.log("Deployed! Status:", probRes.status, "Data:", data);
            break;
        }
        console.log("Still old version, retrying in 10s...");
        await new Promise(r => setTimeout(r, 10000));
    }
};

pollAi();
