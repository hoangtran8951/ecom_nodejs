using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ecom.Models
{
    public class KeyTokenModel
    {
        public string ShopID {get; set;} = string.Empty;
        public string publicKey {get; set;} = string.Empty;
        public string privateKey {get; set;} = string.Empty;
        public List<string> RefreshToken {get; set;} = new List<string>();
    }
}