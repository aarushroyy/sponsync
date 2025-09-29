import prisma from '@/app/lib/prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

// const transporter = nodemailer.createTransport({
//   service: process.env.EMAIL_SERVICE,
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: 'sponsyncc@gmail.com',
      pass: 'rkbqmqucbpevuycp'
    },
    logger: true,
    debug: true,
  });
  

const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, 10);
};

const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: '24h' });
};

// const sendVerificationEmail = async (userId: string, email: string): Promise<void> => {
//   const token = generateToken(userId);
//   const verificationLink = `${process.env.BASE_URL}/api/auth/verify-email?token=${token}`;

//   await transporter.sendMail({
//     to: email,
//     subject: 'Verify your email',
//     html: `Click <a href="${verificationLink}">here</a> to verify your email.`,
//   });
// };

const sendVerificationEmail = async (userId: string, email: string): Promise<void> => {
  const token = generateToken(userId);
  // Use the appropriate deployment URL, not localhost
  const verificationLink = `sponsync.com/api/auth/verify-email?token=${token}`;

  await transporter.sendMail({
    to: email,
    subject: 'Verify your email for Sponsync',
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verify Your Email - Sponsync</title>
          <style>
              @import url('https://fonts.googleapis.com/css2?family=Geist+Sans:wght@300;400;500;600;700&display=swap');
              
              body {
                  font-family: 'Geist Sans', sans-serif;
                  margin: 0;
                  padding: 0;
                  background-color: #f7f9fc;
                  color: #333;
                  line-height: 1.6;
              }
              
              .email-container {
                  max-width: 600px;
                  margin: 20px auto;
                  background-color: #ffffff;
                  border-radius: 12px;
                  overflow: hidden;
                  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
              }
              
              .email-header {
                  background: linear-gradient(135deg, #FF6B35 0%, #FF8C42 100%);
                  padding: 30px 0;
                  text-align: center;
                  color: white;
              }
              
              .logo-text {
                  font-size: 32px;
                  font-weight: 700;
                  margin-bottom: 0;
                  color: #000000;
              }
              
              .email-body {
                  padding: 40px 30px;
                  text-align: center;
              }
              
              h1 {
                  color: #FF6B35;
                  font-size: 28px;
                  margin-top: 0;
                  margin-bottom: 24px;
                  font-weight: 600;
              }
              
              p {
                  margin-bottom: 24px;
                  font-size: 16px;
                  color: #4a5568;
              }
              
              .verification-button {
                  display: inline-block;
                  background: linear-gradient(135deg, #FF6B35 0%, #FF8C42 100%);
                  color: white;
                  font-weight: 500;
                  text-decoration: none;
                  padding: 14px 36px;
                  border-radius: 8px;
                  margin: 20px 0;
                  font-size: 16px;
                  border: none;
              }
              
              .verification-link {
                  margin-top: 30px;
                  padding: 16px;
                  background-color: #f5f7fa;
                  border-radius: 8px;
                  word-break: break-all;
                  font-size: 14px;
                  color: #FF6B35;
                  text-align: left;
              }
              
              .expiration-notice {
                  font-size: 14px;
                  color: #718096;
                  margin-top: 30px;
                  padding-top: 20px;
                  border-top: 1px solid #edf2f7;
              }
              
              .email-footer {
                  background-color: #f5f7fa;
                  padding: 30px;
                  text-align: center;
                  color: #718096;
                  font-size: 14px;
                  border-top: 1px solid #edf2f7;
              }
              
              .copyright {
                  margin-top: 15px;
                  font-size: 12px;
              }
              
              .highlight {
                  position: relative;
                  display: inline-block;
              }
              
              .highlight::after {
                  content: '';
                  position: absolute;
                  bottom: 0;
                  left: 0;
                  width: 100%;
                  height: 8px;
                  background-color: rgba(255, 107, 53, 0.2);
                  z-index: -1;
                  border-radius: 4px;
              }
          </style>
      </head>
      <body>
          <div class="email-container">
              <div class="email-header">
                  <h1 class="logo-text">Spon<span style="color: #FFFFFF;">Sync</span></h1>
              </div>
              
              <div class="email-body">
                  <h1>Confirm your email address</h1>
                  
                  <p>Thanks for signing up with Sponsync, your bridge between colleges and sponsors! Please verify your email address to complete your registration.</p>
                  
                  <a href="${verificationLink}" class="verification-button">
                      Verify My Email
                  </a>
                  
                  <p>This verification link will expire in <span class="highlight">24 hours</span> for security reasons.</p>
                  
                  <div class="verification-link">
                      <strong>If the button doesn't work, copy and paste this URL into your browser:</strong><br>
                      <a href="${verificationLink}">${verificationLink}</a>
                  </div>
                  
                  <div class="expiration-notice">
                      <p>If you did not create an account with Sponsync, please ignore this email.</p>
                  </div>
              </div>
              
              <div class="email-footer">
                  <p>Best regards,<br>The Sponsync Team</p>
                  
                  <div class="copyright">
                      © ${new Date().getFullYear()} Sponsync. All rights reserved.
                  </div>
              </div>
          </div>
      </body>
      </html>
    `,
  });
};

export const companyAuthService = {
  async register(userData: {
    email: string;
    password: string;
    personName: string;
    position: string;
    companyName: string;
    phone: string;
    workEmail: string;
    linkedIn: string;
  }) {
    // LinkedIn URL is already normalized and validated in the API route
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const user = await prisma.companyUser.create({
      data: {
        email: userData.email,
        password: hashedPassword,
        personName: userData.personName,
        position: userData.position,
        companyName: userData.companyName,
        phone: userData.phone,
        workEmail: userData.workEmail,
        linkedin: userData.linkedIn,
        isVerified: false,
      },
    });

    // Send verification email
    try {
      await sendVerificationEmail(user.id, user.email);
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
    }

    return user;
  },

  async login(email: string, password: string) {
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    const user = await prisma.companyUser.findUnique({ 
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        personName: true,
        companyName: true,
        isVerified: true
      }
    });

    if (!user) {
      throw new Error('User not found');
    }
    
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new Error('Invalid password');
    }
    
    if (!user.isVerified) {
      throw new Error('Email not verified');
    }
    
    // Create new object without password using object destructuring
    const { id, email: userEmail, personName, companyName, isVerified } = user;
    const userWithoutPassword = { id, email: userEmail, personName, companyName, isVerified };
    
    return { 
      user: userWithoutPassword, 
      token: generateToken(user.id)
    };
  }
};

export const collegeAuthService = {
  async register(data: {
    email: string;
    password: string;
    name: string;
    collegeName: string;
    eventName: string;
    phone: string;
  }) {
    try {
      const hashedPassword = await hashPassword(data.password);
      const user = await prisma.collegeUser.create({
        data: {
          email: data.email,
          password: hashedPassword,
          name: data.name,
          collegeName: data.collegeName,
          eventName: data.eventName,
          phone: data.phone,
          isVerified: true
        },
      });

      try {
        await sendVerificationEmail(user.id, user.email);
      } catch (emailError) {
        console.error('Email sending failed:', emailError);
      }

      return user;
    } catch (error) {
      console.error('College registration error:', error);
      throw error;
    }
  },

  async login(email: string, password: string) {
    const user = await prisma.collegeUser.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        name: true,
        collegeName: true,
        eventName: true,
        isVerified: true,
        onboardingComplete: true
      }
    });

    if (!user) throw new Error('User not found');
    if (!await bcrypt.compare(password, user.password)) throw new Error('Invalid password');
    if (!user.isVerified) throw new Error('Email not verified');

    const { 
        id, 
        email: userEmail, 
        name, 
        collegeName, 
        eventName, 
        isVerified, 
        onboardingComplete 
      } = user;
      
      return { 
        user: { id, email: userEmail, name, collegeName, eventName, isVerified, onboardingComplete },
        token: generateToken(user.id)
      };
    }
  };

// Update to src/app/services/auth.service.ts - spocAuthService section

export const spocAuthService = {
  async register(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone: string;
    collegeRollNumber: string;
    idCardUrl: string;
  }) {
    try {
      const hashedPassword = await hashPassword(data.password);
      const user = await prisma.spocUser.create({
        data: {
          email: data.email,
          password: hashedPassword,
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
          collegeRollNumber: data.collegeRollNumber,
          idCardUrl: data.idCardUrl,
          isVerified: false,
          isApproved: false // SPOCs start as not approved
        },
      });

      try {
        await sendVerificationEmail(user.id, user.email);
      } catch (emailError) {
        console.error('Email sending failed:', emailError);
        // Continue even if email fails
      }

      return user;
    } catch (error) {
      console.error('SPOC registration error:', error);
      throw error;
    }
  },

  async login(email: string, password: string) {
    if (!email || !password) {
      throw new Error('Email and password are required');
    }
    const user = await prisma.spocUser.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        firstName: true,
        lastName: true,
        isVerified: true,
        isApproved: true,
        assignedCollegeId: true
      }
    });

    if (!user) throw new Error('User not found');
    if (!await bcrypt.compare(password, user.password)) throw new Error('Invalid password');
    if (!user.isVerified) throw new Error('Email not verified');

    const { 
      id, 
      email: userEmail, 
      firstName, 
      lastName, 
      isVerified, 
      isApproved,
      assignedCollegeId
    } = user;
    
    return { 
      user: { 
        id, 
        email: userEmail, 
        firstName, 
        lastName, 
        isVerified, 
        isApproved,
        assignedCollegeId
      },
      token: generateToken(user.id)
    };
  }
};

export const adminAuthService = {
  async register(data: {
    email: string;
    password: string;
    name: string;
    phone?: string;
  }) {
    try {
      const hashedPassword = await hashPassword(data.password);
      const user = await prisma.adminUser.create({
        data: {
          email: data.email,
          password: hashedPassword,
          name: data.name,
          phone: data.phone,
        },
      });

      try {
        await sendVerificationEmail(user.id, user.email);
      } catch (emailError) {
        console.error('Email sending failed:', emailError);
      }

      return user;
    } catch (error) {
      console.error('Admin registration error:', error);
      throw error;
    }
  },

  async login(email: string, password: string) {
    const user = await prisma.adminUser.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        name: true,
        isVerified: true
      }
    });

    if (!user) throw new Error('User not found');
    if (!await bcrypt.compare(password, user.password)) throw new Error('Invalid password');
    if (!user.isVerified) throw new Error('Email not verified');

    const { 
        id, 
        email: userEmail, 
        name, 
        isVerified 
      } = user;
      
      return { 
        user: { id, email: userEmail, name, isVerified },
        token: generateToken(user.id)
      };
    }
  };

export const verificationService = {
  async verifyEmail(token: string) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
      
      const updateUser = async (model: keyof Pick<typeof prisma, 'companyUser' | 'collegeUser' | 'spocUser' | 'adminUser'>) => {
        try {
          await (prisma[model] as typeof prisma.companyUser).update({
            where: { id: decoded.userId },
            data: { isVerified: true },
          });
          return true;
        } catch {
          return false;
        }
      };

      if (await updateUser('companyUser')) return;
      if (await updateUser('collegeUser')) return;
      if (await updateUser('spocUser')) return;
      if (await updateUser('adminUser')) return;
      
      throw new Error('User not found');
    } catch {
      throw new Error('Invalid or expired token');
    }
  }
};