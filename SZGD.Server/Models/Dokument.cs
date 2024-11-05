namespace SZGD.Server.Models
{
    public class Dokument
    {
        // Właściwości klasy Dokument
        public int Id { get; set; }
        public string Nazwa { get; set; }
        public string Typ { get; set; }
        public DateTime DataZakupu { get; set; }
        public DateTime DataWygaszeniaGwarancji { get; set; }
        public string Producent { get; set; }
        public byte[] Zalacznik { get; set; } // Pole przechowujące załącznik pliku

        // Konstruktor z parametrami
        public Dokument(int id, string nazwa, string typ, DateTime dataZakupu, DateTime dataWygaszeniaGwarancji, string producent, byte[] zalacznik)
        {
            Id = id;
            Nazwa = nazwa;
            Typ = typ;
            DataZakupu = dataZakupu;
            DataWygaszeniaGwarancji = dataWygaszeniaGwarancji;
            Producent = producent;
            Zalacznik = zalacznik;
        }
    }
}
