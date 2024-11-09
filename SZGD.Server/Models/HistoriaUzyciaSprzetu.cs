namespace SZGD.Server.Models
{
    public class HistoriaUzyciaSprzetu
    {
        public int Id { get; set; }
        public Sprzet Sprzet { get; set; }
        public Domownik Domownik { get; set; }
        public DateTime DataUzycia { get; set; }
        public bool CzyWystapilaAwaria { get; set; }
        public string KomentarzDoAwarii { get; set; }
    }
}