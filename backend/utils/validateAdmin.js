const {org_domain} = require('../config/index');

const verifyDomain = (email) => {
    
    return (email.search('@' + org_domain) != -1);
    
}

module.exports = {verifyDomain};