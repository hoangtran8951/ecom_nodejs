using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ecom.Models;

namespace ecom.Interfaces
{
    public interface ITokenService
    {
        string CreateToken(ShopModel shop, int expires, string publicKey, string privateKey);
    }
}