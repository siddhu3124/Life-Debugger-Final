import axios from "axios";

const API_URL = "https://life-debugger-final.onrender.com/api";

const testRender = async () => {
    try {
        const timestamp = Date.now();
        const email = `test${timestamp}@example.com`;
        const password = "password123";
        const name = "Test User";

        console.log("Registering test user...");
        const regRes = await axios.post(`${API_URL}/auth/register`, { name, email, password });
        const token = regRes.data.token;
        console.log("Registered! Token:", token ? "Received" : "None");

        console.log("Analyzing problem on Render...");
        const probRes = await axios.post(`${API_URL}/problems/add`, {
            problem: "I feel very stressed about my work.",
            category: "Work"
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });

        console.log("Success:", probRes.data);
    } catch (err) {
        if (err.response) {
            console.error("Render Backend Error:", err.response.status, err.response.data);
        } else {
            console.error("Error:", err.message);
        }
    }
};

testRender();
