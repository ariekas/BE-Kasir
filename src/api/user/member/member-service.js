const prisma = require("../../../config/db");
const { addMonths, differenceInDays } = require("date-fns");

const createMember = async (data) => {

  const createdAt = new Date();
  const expirationDate = addMonths(createdAt, 1);
  const timeLeftInDays = Math.ceil(
    (expirationDate - createdAt) / (1000 * 60 * 60 * 24)
  );
  data.TimeLeft = `${timeLeftInDays} days`;

  data.status = "ACTIVE";
  data.memberDiscount = 5.0;


  const create = await prisma.member.create({ data });

  return create;
};

const statusMember = async () => {
    const members = await prisma.member.findMany(); // Ambil semua member
  
    const now = new Date();
    
    for (let member of members) {
      const expirationDate = addMonths(member.createAt, 1);
      const daysLeft = differenceInDays(expirationDate, now);
  
      let newStatus = daysLeft > 0 ? "ACTIVE" : "INACTIVE";
  
      if (member.status !== newStatus) {
        await prisma.member.update({
          where: { id: member.id },
          data: { status: newStatus, TimeLeft: `${Math.max(daysLeft, 0)} days` },
        });
      }
    }
  };
  
 
  

const getMembers = async () => {
  const getAll = await prisma.member.findMany();
  
  return getAll;
};



module.exports = {
  createMember,
  getMembers,
  statusMember
};
