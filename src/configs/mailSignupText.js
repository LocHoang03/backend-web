require('dotenv').config();

const emailSignupTemplate = (email, password) => `
   <div style="width: 100%; max-width:600px; margin: 0 auto">
        <div style="text-align: left; margin: 1.2rem 0">
            <img src=${
              process.env.IMAGE_BANNER
            } alt="image-banner-showhub" style="width: 150px; height: 30px"/>
        </div>
        <div style="width: 100%;margin: auto; font-family: Roboto, sans-serif; border: 1px solid #f0f0f0; text-align: left">
            <div style="padding: 20px;">
                <h2 style="margin: 0; margin-bottom: 30px; font-weight: 300; line-height: 1.5; font-size: 24px; color: #294661 !important;">Hello ${email},</h2>

                <p style="margin: 0; margin-bottom: 30px; color: #294661; font-size: 16px; font-weight: 300;">Your request to create a new ShowHub account has been received.</p>

                <div style="text-align: center;margin-bottom: 30px"><span style="box-sizing: border-box;border-color: #348eda;font-weight: 400;text-decoration: none;display: inline-block;margin: 0;color: #ffffff;background-color: #348eda;border: solid 1px #348eda;border-radius: 2px;font-size: 14px;padding: 12px 45px;">Password: ${password}</span></div>

                <div style="text-align: center;margin-bottom: 30px"><a href="http://localhost:3000/auth/login" style="box-sizing: border-box;border-color: #348eda;font-weight: 400;text-decoration: none;display: inline-block;margin: 0;color: #ffffff;background-color: #00c9d3;border: solid 1px #348eda;border-radius: 2px;font-size: 14px;padding: 12px 45px;">Go to Login Page</a></div>

                <p style="margin: 0;margin-bottom: 30px;color: #294661;font-size: 16px;font-weight: 300;">If you did not initiate this request, please contact us immediately at hoangphuocloc.phurieng@gmail.com.</p>

                <p style="margin: 0;margin-bottom: 30px;color: #294661;font-size: 16px;font-weight: 300;">Thank you,<br>The ShowHub Team</p>
            </div>
            <div style="background-color: #f8f8f8; padding: 10px; text-align: center; border-top: 1px solid #ddd;">
                <div>
                    <img src=${
                      process.env.IMAGE_BANNER
                    } alt="image-banner-showhub" style="width: 75px; height: 15px; margin-top: 1em"/>
                </div>
                <p>&copy; ${new Date(
                  Date.now(),
                ).getFullYear()} ShowHub. All rights reserved.</p>
            </div>
        </div>
   </div>
`;

module.exports = emailSignupTemplate;
