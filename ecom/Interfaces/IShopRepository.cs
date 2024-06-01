using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ecom.Dto.Shop;
using ecom.Models;
using Microsoft.Identity.Client;

namespace ecom.Interfaces
{
    public interface IShopRepository
    {
        public Task<bool> CheckEmailExistedAsync(string email);
        public Task<ShopModel?> GetByIdAsync(string id);
        public Task<ShopModel?> CreateShop(string Name, string Email, string Password, List<string> Roles);
    }
}