namespace SZGD.Server.Models
{
    public class Paragon
    {
        // Właściwości klasy Dokument
        public string Date { get; set; }
        public string StoreName { get; set; }
        public List<PozycjaParagonu> Items { get; set; } = new List<PozycjaParagonu>();
        public double TotalAmount { get; set; }
    }
}
