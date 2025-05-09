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

const sendVerificationEmail = async (userId: string, email: string): Promise<void> => {
  const token = generateToken(userId);
  const verificationLink = `${process.env.BASE_URL}/api/auth/verify-email?token=${token}`;

  await transporter.sendMail({
    to: email,
    subject: 'Verify your email',
    html: `Click <a href="${verificationLink}">here</a> to verify your email.`,
  });
};

export const companyAuthService = {
  async register(data: {
    email: string;
    password: string;
    personName: string;
    position: string;
    companyName: string;
    phone: string;
  }) {
    try {
      console.log('Processing registration for:', data.email);
      
      const hashedPassword = await hashPassword(data.password);
      const user = await prisma.companyUser.create({
        data: {
          email: data.email,
          password: hashedPassword,
          personName: data.personName,
          position: data.position,
          companyName: data.companyName,
          phone: data.phone,
          isVerified: true
        },
      });

      console.log('User created with ID:', user.id);
      
      try {
        await sendVerificationEmail(user.id, user.email);
        console.log('Verification email sent to:', user.email);
      } catch (emailError) {
        console.error('Email sending failed:', emailError);
        // Continue even if email fails
      }

      return user;
    } catch (error: unknown) {
      console.error('Company registration error:', error);
      throw error;
    }
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