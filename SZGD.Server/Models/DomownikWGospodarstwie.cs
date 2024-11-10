using System.ComponentModel.DataAnnotations.Schema;

namespace SZGD.Server.Models
{
    public enum DomownikRole
    {
        Starzec,
        Rodzic,
        Dziecko
    }

    public class DomownikWGospodarstwie
    {
        public bool CzyWidziInformacjeMedyczneDomownikow { get; set; } = false;
        public bool CzyWidziSprzet { get; set; } = false;
        public bool CzyWidziDomownikow { get; set; } = false;
        public bool CzyMozeModyfikowacDomownikow { get; set; } = false;
        public bool CzyMozeModyfikowacGospodarstwo { get; set; } = false;
        public bool CzyMozePrzesylacPliki { get; set; } = false;
        public List<HistoriaUzyciaSprzetu>? HistoriaUzyciaSprzetu { get; set; }

        [ForeignKey(nameof(Domownik))]
        public string DomownikId { get; set; }

        [ForeignKey(nameof(Gospodarstwo))]
        public int GospodarstwoId { get; set; }

        public DomownikRole Rola { get; set; }  // New enum property
    }
}