const API_URL = "https://life-debugger-final.onrender.com/api";

const testRender = async () => {
    try {
        const timestamp = Date.now();
        const email = `test${timestamp}@example.com`;
        const password = "password123";
        const name = "Test User";

        const regRes = await fetch(`${API_URL}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password })
        });

        if (!regRes.ok) {
            console.error("Failed to register:", await regRes.text());
            return;
        }

        const loginRes = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const loginData = await loginRes.json();
        const token = loginData.token;
        console.log("Logged in! Token:", token ? "Received" : "None");

        console.log("Analyzing problem on Render...");
        const probRes = await fetch(`${API_URL}/problems/add`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                problem: "I feel very stressed about my work.",
                category: "Work"
            })
        });

        if (!probRes.ok) {
            console.error("Render Backend Error:", probRes.status, await probRes.text());
            return;
        }

        console.log("Success:", await probRes.json());
    } catch (err) {
        console.error("Error:", err.message);
    }
};

testRender();
