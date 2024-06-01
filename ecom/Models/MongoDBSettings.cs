using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ecom.Models
{
    public class MongoDBSettings
    {
        public string Connection_URL {get; set;} = null!;
        public string DatabaseName {get; set;} = null!;
        public string ShopCollection {get; set;} = null!;
        public string KeyTokenCollection {get; set;} = null!;

    }
}