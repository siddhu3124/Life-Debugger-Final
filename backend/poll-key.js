const poll = async () => {
    console.log("Polling /api/debug-key for deploy...");
    while (true) {
        try {
            const res = await fetch("https://life-debugger-final.onrender.com/api/debug-key");
            if (res.ok) {
                const data = await res.json();
                console.log("Deployed! Key stats:", data);
                break;
            }
        } catch (err) { }
        await new Promise(r => setTimeout(r, 5000));
    }
};

poll();
