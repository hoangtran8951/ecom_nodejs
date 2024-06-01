using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ecom.Interfaces;
using ecom.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace ecom.Repository
{
    public class KeyTokenRepository : IKeyTokenRepository
    {
        private readonly IMongoCollection<KeyTokenModel> _keyTokenCollection;
        public KeyTokenRepository(IOptions<MongoDBSettings> MongoDBSettings)
        {
            var mongoClient = new MongoClient(
                MongoDBSettings.Value.Connection_URL);

            var mongoDatabase = mongoClient.GetDatabase(
                MongoDBSettings.Value.DatabaseName);

            _keyTokenCollection = mongoDatabase.GetCollection<KeyTokenModel>(
                MongoDBSettings.Value.KeyTokenCollection);
        }

        public async Task<KeyTokenModel> CreateKeyTokens(string userId, string publicKey, string privateKey)
        {
            var keyToken = new KeyTokenModel
            {
                ShopID = userId,
                publicKey = publicKey,
                privateKey = privateKey
            };
            await _keyTokenCollection.InsertOneAsync(keyToken);
            return keyToken;
        }
    }
}