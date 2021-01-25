const db = require('../utils/db');
const TBL_ROLE = 'role';
module.exports = {
    totalRole: async function () {
        const totalRole = await db.load(`select count(*) as total_role from ${TBL_ROLE}`);
        return totalRole[0].total_role;
    },
    
}