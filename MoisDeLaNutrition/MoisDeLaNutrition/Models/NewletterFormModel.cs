using System.Web;

namespace MoisDeLaNutrition.Models
{
    public class NewsletterFormModel
    {
        public string Email { get; set; }
        public string Token { get; set; }
        public string Captcha { get; set; }
        public string Userlang { get; set; }
    }
}