const {org_domain} = require('../config/index');

const verifyDomain = (email) => {
    
    (email.search('@' + org_domain) != -1);
    
}

module.exports = {verifyDomain};