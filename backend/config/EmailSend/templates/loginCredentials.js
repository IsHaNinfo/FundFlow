const getLoginCredentialsTemplate = (email, password) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
            }
            .header {
                background-color: #2563eb;
                color: white;
                padding: 20px;
                text-align: center;
                border-radius: 5px 5px 0 0;
            }
            .content {
                padding: 20px;
                background-color: #f9fafb;
                border: 1px solid #e5e7eb;
                border-radius: 0 0 5px 5px;
            }
            .credentials {
                background-color: #f3f4f6;
                padding: 15px;
                border-radius: 5px;
                margin: 20px 0;
            }
            .footer {
                text-align: center;
                margin-top: 20px;
                font-size: 12px;
                color: #6b7280;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>FundFlow</h1>
                <p>Microfinance Credit Scoring & Lending Portal</p>
            </div>
            <div class="content">
                <h2>Welcome to FundFlow!</h2>
                <p>Your account has been created successfully. Here are your login credentials:</p>
                
                <div class="credentials">
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Password:</strong> ${password}</p>
                </div>

                
                <p>You can login to your account at: <a href="${process.env.FRONTEND_URL}/login">${process.env.FRONTEND_URL}/login</a></p>
            </div>
            <div class="footer">
                <p>This is an automated message, please do not reply to this email.</p>
                <p>&copy; ${new Date().getFullYear()} FundFlow. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    `;
};

export default getLoginCredentialsTemplate;