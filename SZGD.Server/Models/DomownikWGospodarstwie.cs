using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

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
        [JsonIgnore]
        public List<HistoriaUzyciaSprzetu>? HistoriaUzyciaSprzetu { get; set; }

        [ForeignKey(nameof(Domownik))]
        public string DomownikId { get; set; }

        [ForeignKey(nameof(Gospodarstwo))]
        public int GospodarstwoId { get; set; }
        [JsonIgnore]
        public Domownik? Domownik { get; set; }
        [JsonIgnore]
        public Gospodarstwo? Gospodarstwo { get; set; }
        public DomownikRole Rola { get; set; }  // New enum property
    }
}