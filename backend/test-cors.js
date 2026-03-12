const testCORS = async () => {
    const url = "https://life-debugger-final.onrender.com/api/auth/login";
    console.log("Testing CORS with fetch for:", url);
    try {
        const response = await fetch(url, {
            method: 'OPTIONS',
            headers: {
                'Origin': 'http://localhost:5173',
                'Access-Control-Request-Method': 'POST',
                'Access-Control-Request-Headers': 'content-type'
            }
        });
        console.log("Preflight Status:", response.status);
        console.log("Allow-Origin:", response.headers.get('access-control-allow-origin'));
        console.log("Allow-Methods:", response.headers.get('access-control-allow-methods'));
        console.log("Allow-Headers:", response.headers.get('access-control-allow-headers'));
    } catch (err) {
        console.error("CORS Test Error:", err.message);
    }
};

testCORS();
