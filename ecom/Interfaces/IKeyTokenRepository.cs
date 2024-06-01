using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ecom.Models;

namespace ecom.Interfaces
{
    public interface IKeyTokenRepository
    {
        public Task<KeyTokenModel> CreateKeyTokens(string userId, string publicKey, string privateKey);
    }
}