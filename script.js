console.log("SCRIPT.JS IS WORKING");

fetch("./sales-data.csv")
    .then(response => {
        console.log("CSV response:", response.status);

        if (!response.ok) {
            throw new Error("CSV could not be loaded");
        }

        return response.text();
    })
    .then(csv => {

        console.log("CSV DATA:", csv);

        const rows = csv.trim().split(/\r?\n/);

        console.log("Number of rows:", rows.length);

        const data = rows.slice(1).map(row => {

            const values = row.split(",");

            return {
                Department: values[0].trim(),
                Quarter: values[1].trim(),
                Revenue: Number(values[2].trim()),
                Product: values[3].trim(),
                Customer: values[4].trim(),
                Shipping_Mode: values[5].trim(),
                Shipping_Delay: Number(values[6].trim()),
                Order_Status: values[7].trim()
            };

        });

        // TOTAL REVENUE
        const totalRevenue = data.reduce(
            (sum, item) => sum + item.Revenue,
            0
        );

        // TOTAL ORDERS
        const totalOrders = data.length;

        // COMPLETED
        const completedOrders = data.filter(
            item => item.Order_Status === "Completed"
        ).length;

        // CANCELLED
        const cancelledOrders = data.filter(
            item => item.Order_Status === "Cancelled"
        ).length;

        // AVERAGE DELAY
        const averageDelay =
            data.reduce(
                (sum, item) => sum + item.Shipping_Delay,
                0
            ) / data.length;

        // DISPLAY
        document.getElementById("totalRevenue").textContent =
            "₹" + totalRevenue.toLocaleString("en-IN");

        document.getElementById("totalOrders").textContent =
            totalOrders;

        document.getElementById("completedOrders").textContent =
            completedOrders;

        document.getElementById("cancelledOrders").textContent =
            cancelledOrders;

        document.getElementById("averageDelay").textContent =
            averageDelay.toFixed(1) + " days";

        console.log("FINAL DATA:", data);
        console.log("TOTAL REVENUE:", totalRevenue);

    })
    .catch(error => {
        console.error("ERROR:", error);
    });
