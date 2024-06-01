using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ecom.Dto.Shop;
using ecom.Interfaces;
using ecom.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace ecom.Repository
{
    public class ShopRepository : IShopRepository
    {
        private readonly IMongoCollection<ShopModel> _shopCollection;
        public ShopRepository(IOptions<MongoDBSettings> MongoDBSettings)
        {
            var mongoClient = new MongoClient(
                MongoDBSettings.Value.Connection_URL);

            var mongoDatabase = mongoClient.GetDatabase(
                MongoDBSettings.Value.DatabaseName);

            _shopCollection = mongoDatabase.GetCollection<ShopModel>(
                MongoDBSettings.Value.ShopCollection);
        }

        public async Task<bool> CheckEmailExistedAsync(string email)
        {
            if((await (await _shopCollection.FindAsync(s => s.Email == email)).ToListAsync()).Count > 0)
                return false;
            return true;
        }

        public Task<ShopModel?> GetByIdAsync(string id)
        {
            throw new NotImplementedException();
        }

        public async Task<ShopModel?> CreateShop(string Name, string Email, string Password, List<string> Roles)
        {
            
            var shop = new ShopModel
            {
                Name = Name,
                Email = Email,
                Password =  Password,
                isActived = false,
                Verify = false,
                Roles = Roles
            };
            await _shopCollection.InsertOneAsync(shop);
            return shop;
        }
    }
}