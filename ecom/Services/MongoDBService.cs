using Microsoft.Extensions.Options;
using MongoDB.Driver;
using MongoDB.Bson;
using ecom.Models;
using MongoDB.Driver.Core.Configuration;


namespace ecom.Services
{
    public class MongoDBService
    {
        private readonly IConfiguration _configuration;
        // private readonly IMongoDatabase _database;
        public MongoDBService(IConfiguration configuration)
        {
            _configuration = configuration;
            // var connectionString = _configuration.GetConnectionString("DbConnections");
            // var mongoURL = MongoUrl.Create(connectionString);
            // var mongoClient = new MongoClient(mongoURL);
            var settings = new MongoClientSettings()
            {
                Scheme = ConnectionStringScheme.MongoDB, 
                Server = new MongoServerAddress("127.0.0.1", 27017), 
                ConnectTimeout = TimeSpan.FromSeconds(60),
                UseTls = false,
                MaxConnectionPoolSize = 50,
            };
            var mongoClient = new MongoClient(settings);
            // _database = mongoClient.GetDatabase(mongoURL.DatabaseName);
        }
        // public IMongoDatabase? Database => _database;
    }
}