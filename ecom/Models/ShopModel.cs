using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace ecom.Models
{
    public class ShopModel
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id {get; set;} = string.Empty;
        public string Name {get; set; } = string.Empty;
        public string Email {get; set; } = string.Empty;
        public string Password {get; set; } = string.Empty;
        public bool isActived {get; set; } = false;
        public bool Verify {get; set; } = false;
        public List<string> Roles {get; set; } = new List<string>();
    }
}