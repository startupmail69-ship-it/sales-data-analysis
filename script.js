/* =========================================
   SALES DATA ANALYSIS DASHBOARD
========================================= */

fetch("sales-data.csv")
    .then(response => {

        if (!response.ok) {
            throw new Error("Unable to load sales-data.csv");
        }

        return response.text();
    })

    .then(csv => {

        /* =========================================
           READ CSV DATA
        ========================================= */

        const rows = csv.trim().split("\n");

        const headers = rows[0].split(",");

        const data = rows.slice(1).map(row => {

            const values = row.split(",");

            let item = {};

            headers.forEach((header, index) => {
                item[header.trim()] =
                    values[index]?.trim();
            });

            item.Revenue =
                Number(item.Revenue);

            item.Shipping_Delay =
                Number(item.Shipping_Delay);

            return item;
        });


        /* =========================================
           KPI CALCULATIONS
        ========================================= */

        const totalRevenue = data.reduce(
            (sum, item) => sum + item.Revenue,
            0
        );

        const totalOrders = data.length;

        const uniqueCustomers =
            new Set(
                data.map(item => item.Customer)
            ).size;

        const averageDelay =
            data.reduce(
                (sum, item) =>
                    sum + item.Shipping_Delay,
                0
            ) / data.length;


        /* =========================================
           UPDATE KPI CARDS
        ========================================= */

        const metricValues =
            document.querySelectorAll(
                ".metric-value"
            );

        if (metricValues.length >= 4) {

            metricValues[0].textContent =
                "₹ " +
                totalRevenue.toLocaleString("en-IN");

            metricValues[1].textContent =
                totalOrders;

            metricValues[2].textContent =
                uniqueCustomers;

            metricValues[3].textContent =
                averageDelay.toFixed(1) +
                " Days";
        }


        /* =========================================
           REVENUE BY QUARTER
        ========================================= */

        const quarters = [
            "Q1",
            "Q2",
            "Q3",
            "Q4"
        ];

        const quarterRevenue =
            quarters.map(quarter => {

                return data
                    .filter(
                        item =>
                            item.Quarter === quarter
                    )
                    .reduce(
                        (sum, item) =>
                            sum + item.Revenue,
                        0
                    );
            });


        new Chart(
            document.getElementById(
                "revenueQuarterChart"
            ),
            {
                type: "line",

                data: {

                    labels: quarters,

                    datasets: [{

                        label: "Revenue",

                        data: quarterRevenue,

                        borderWidth: 3,

                        tension: 0.4,

                        fill: false
                    }]
                },

                options: {
                    responsive: true
                }
            }
        );


        /* =========================================
           REVENUE BY DEPARTMENT
        ========================================= */

        const departments = [
            ...new Set(
                data.map(
                    item => item.Department
                )
            )
        ];

        const departmentRevenue =
            departments.map(department => {

                return data
                    .filter(
                        item =>
                            item.Department ===
                            department
                    )
                    .reduce(
                        (sum, item) =>
                            sum + item.Revenue,
                        0
                    );
            });


        new Chart(
            document.getElementById(
                "departmentRevenueChart"
            ),
            {
                type: "bar",

                data: {

                    labels: departments,

                    datasets: [{

                        label: "Revenue",

                        data:
                            departmentRevenue,

                        borderWidth: 1
                    }]
                },

                options: {

                    responsive: true,

                    scales: {

                        y: {
                            beginAtZero: true
                        }
                    }
                }
            }
        );


        /* =========================================
           TOP 5 PRODUCTS
        ========================================= */

        const products = {};

        data.forEach(item => {

            if (!products[item.Product]) {

                products[item.Product] = 0;
            }

            products[item.Product] +=
                item.Revenue;
        });


        const topProducts =
            Object.entries(products)
                .sort(
                    (a, b) => b[1] - a[1]
                )
                .slice(0, 5);


        new Chart(
            document.getElementById(
                "topProductsChart"
            ),
            {
                type: "bar",

                data: {

                    labels:
                        topProducts.map(
                            item => item[0]
                        ),

                    datasets: [{

                        label: "Revenue",

                        data:
                            topProducts.map(
                                item => item[1]
                            ),

                        borderWidth: 1
                    }]
                },

                options: {

                    indexAxis: "y",

                    responsive: true
                }
            }
        );


        /* =========================================
           SHIPPING PERFORMANCE
        ========================================= */

        const onTimeOrders =
            data.filter(
                item =>
                    item.Shipping_Delay <= 3
            ).length;

        const delayedOrders =
            data.filter(
                item =>
                    item.Shipping_Delay > 3
            ).length;


        new Chart(
            document.getElementById(
                "shippingChart"
            ),
            {
                type: "doughnut",

                data: {

                    labels: [
                        "On Time",
                        "Delayed"
                    ],

                    datasets: [{

                        data: [
                            onTimeOrders,
                            delayedOrders
                        ],

                        borderWidth: 2
                    }]
                },

                options: {

                    responsive: true,

                    plugins: {

                        legend: {
                            position: "bottom"
                        }
                    }
                }
            }
        );


        /* =========================================
           BUSINESS INSIGHTS
        ========================================= */


        /* Highest Revenue Department */

        const departmentTotals = {};

        data.forEach(item => {

            if (
                !departmentTotals[
                    item.Department
                ]
            ) {

                departmentTotals[
                    item.Department
                ] = 0;
            }

            departmentTotals[
                item.Department
            ] += item.Revenue;

        });


        const bestDepartment =
            Object.entries(
                departmentTotals
            )
                .sort(
                    (a, b) => b[1] - a[1]
                )[0];


        /* =========================================
           TOP PRODUCT
        ========================================= */

        const productTotals = {};

        data.forEach(item => {

            if (
                !productTotals[item.Product]
            ) {

                productTotals[
                    item.Product
                ] = 0;
            }

            productTotals[
                item.Product
            ] += item.Revenue;

        });


        const bestProduct =
            Object.entries(
                productTotals
            )
                .sort(
                    (a, b) => b[1] - a[1]
                )[0];


        /* =========================================
           SHIPPING DELAY %
        ========================================= */

        const delayedPercentage =
            (
                delayedOrders /
                data.length
            ) * 100;


        /* =========================================
           CANCELLATION %
        ========================================= */

        const cancelledOrders =
            data.filter(
                item =>
                    item.Order_Status ===
                    "Cancelled"
            ).length;


        const cancellationPercentage =
            (
                cancelledOrders /
                data.length
            ) * 100;


        /* =========================================
           DISPLAY BUSINESS INSIGHTS
        ========================================= */

        const revenueInsight =
            document.getElementById(
                "revenueInsight"
            );

        if (revenueInsight) {

            revenueInsight.textContent =
                `${bestDepartment[0]} generated the highest revenue with ₹${bestDepartment[1].toLocaleString("en-IN")}.`;
        }


        const productInsight =
            document.getElementById(
                "productInsight"
            );

        if (productInsight) {

            productInsight.textContent =
                `${bestProduct[0]} generated the highest product revenue with ₹${bestProduct[1].toLocaleString("en-IN")}.`;
        }


        const shippingInsight =
            document.getElementById(
                "shippingInsight"
            );

        if (shippingInsight) {

            shippingInsight.textContent =
                `${delayedPercentage.toFixed(1)}% of orders experienced a shipping delay greater than 3 days.`;
        }


        const cancellationInsight =
            document.getElementById(
                "cancellationInsight"
            );

        if (cancellationInsight) {

            cancellationInsight.textContent =
                `${cancellationPercentage.toFixed(1)}% of orders were cancelled.`;
        }


        console.log(
            "Sales data loaded successfully!"
        );

        console.log(
            "Total Revenue:",
            totalRevenue
        );

        console.log(
            "Total Orders:",
            totalOrders
        );

        console.log(
            "Total Customers:",
            uniqueCustomers
        );

    })

    .catch(error => {

        console.error(
            "Error loading sales data:",
            error
        );

    });