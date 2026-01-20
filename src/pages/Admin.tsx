import { useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllManufacturers, getAllPresets, manufacturerConfig } from '@/data/manufacturers';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Plus, Settings, Eye, Save, Building2, Layers } from 'lucide-react';
import type { Manufacturer, Preset } from '@/types/manufacturer';
import type { PlatformMaterial, RailingStyle, FrameMaterial } from '@/components/BalconyModel';

// Einfacher Admin-Schutz (Stub - später durch echte Auth ersetzen)
const ADMIN_PASSWORD = 'admin123';

const PLATFORM_MATERIALS: PlatformMaterial[] = ['douglasie', 'wpc', 'alu'];
const RAILING_STYLES: RailingStyle[] = ['glass', 'glass-double', 'bars'];
const FRAME_MATERIALS: FrameMaterial[] = ['pu-lackiert', 'feuerverzinkt'];
const SUPPORT_COUNTS: (2 | 3 | 4 | 6)[] = [2, 3, 4, 6];

const PLATFORM_LABELS: Record<PlatformMaterial, string> = {
  douglasie: 'Douglasie',
  wpc: 'WPC-Dielen',
  alu: 'Aluschienen',
};

const RAILING_LABELS: Record<RailingStyle, string> = {
  glass: 'Edelstahl verglast',
  'glass-double': 'Doppelter Handlauf',
  bars: 'Rundstäbe',
};

const FRAME_LABELS: Record<FrameMaterial, string> = {
  'pu-lackiert': 'PU-Lackiert',
  feuerverzinkt: 'Feuerverzinkt',
};

const AdminPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [selectedManufacturer, setSelectedManufacturer] = useState<string | null>(null);
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [editingPreset, setEditingPreset] = useState<Preset | null>(null);

  const manufacturers = getAllManufacturers();
  const presets = getAllPresets();

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
    } else {
      alert('Falsches Passwort');
    }
  };

  const handleSelectPreset = (presetId: string) => {
    setSelectedPreset(presetId);
    const preset = presets.find(p => p.id === presetId);
    if (preset) {
      setEditingPreset({ ...preset });
    }
  };

  const handleToggleArrayValue = <T extends string | number>(
    array: T[],
    value: T,
    setter: (arr: T[]) => void
  ) => {
    if (array.includes(value)) {
      setter(array.filter(v => v !== value));
    } else {
      setter([...array, value]);
    }
  };

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-screen w-screen bg-background">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Admin-Zugang
            </CardTitle>
            <CardDescription>Passwort eingeben um fortzufahren</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Passwort</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                placeholder="Admin-Passwort"
              />
            </div>
            <Button onClick={handleLogin} className="w-full">
              Anmelden
            </Button>
            <Button variant="ghost" asChild className="w-full">
              <Link to="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Zurück
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Settings className="h-6 w-6" />
              Admin-Bereich
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Balkonbauer und Presets verwalten
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link to="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Zurück
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Manufacturers List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Building2 className="h-5 w-5" />
                Balkonbauer
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {manufacturers.map((m) => (
                <button
                  key={m.id}
                  onClick={() => {
                    setSelectedManufacturer(m.id);
                    setSelectedPreset(null);
                    setEditingPreset(null);
                  }}
                  className={`w-full text-left p-3 rounded-lg border transition-colors ${
                    selectedManufacturer === m.id
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="font-medium">{m.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {m.presets.length} Produktlinie(n)
                  </div>
                </button>
              ))}
              <Button variant="outline" className="w-full mt-4" disabled>
                <Plus className="h-4 w-4 mr-2" />
                Neuer Balkonbauer
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                (Wird in Zukunft über Datenbank gesteuert)
              </p>
            </CardContent>
          </Card>

          {/* Presets List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Layers className="h-5 w-5" />
                Produktlinien
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {selectedManufacturer ? (
                <>
                  {presets
                    .filter((p) => p.manufacturerId === selectedManufacturer)
                    .map((p) => (
                      <button
                        key={p.id}
                        onClick={() => handleSelectPreset(p.id)}
                        className={`w-full text-left p-3 rounded-lg border transition-colors ${
                          selectedPreset === p.id
                            ? 'border-primary bg-primary/10'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <div className="font-medium">{p.name}</div>
                        <div className="text-xs text-muted-foreground">{p.description}</div>
                      </button>
                    ))}
                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" className="flex-1" disabled>
                      <Plus className="h-4 w-4 mr-2" />
                      Neues Preset
                    </Button>
                  </div>
                </>
              ) : (
                <p className="text-muted-foreground text-sm text-center py-8">
                  Wähle zuerst einen Balkonbauer
                </p>
              )}
            </CardContent>
          </Card>

          {/* Preset Editor */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Settings className="h-5 w-5" />
                Preset bearbeiten
              </CardTitle>
            </CardHeader>
            <CardContent>
              {editingPreset ? (
                <div className="space-y-6">
                  {/* Basic Info */}
                  <div className="space-y-3">
                    <div>
                      <Label>Name</Label>
                      <Input
                        value={editingPreset.name}
                        onChange={(e) =>
                          setEditingPreset({ ...editingPreset, name: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label>Beschreibung</Label>
                      <Input
                        value={editingPreset.description || ''}
                        onChange={(e) =>
                          setEditingPreset({ ...editingPreset, description: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  {/* Allowed Support Counts */}
                  <div className="space-y-2">
                    <Label>Erlaubte Stützenanzahl</Label>
                    <div className="flex flex-wrap gap-2">
                      {SUPPORT_COUNTS.map((count) => (
                        <label key={count} className="flex items-center gap-2 cursor-pointer">
                          <Checkbox
                            checked={editingPreset.allowedSupportCounts.includes(count)}
                            onCheckedChange={() =>
                              handleToggleArrayValue(
                                editingPreset.allowedSupportCounts,
                                count,
                                (arr) =>
                                  setEditingPreset({
                                    ...editingPreset,
                                    allowedSupportCounts: arr as (2 | 3 | 4 | 6)[],
                                  })
                              )
                            }
                          />
                          <span className="text-sm">{count}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Allowed Platform Materials */}
                  <div className="space-y-2">
                    <Label>Erlaubte Bodenbeläge</Label>
                    <div className="space-y-1">
                      {PLATFORM_MATERIALS.map((mat) => (
                        <label key={mat} className="flex items-center gap-2 cursor-pointer">
                          <Checkbox
                            checked={editingPreset.allowedPlatformMaterials.includes(mat)}
                            onCheckedChange={() =>
                              handleToggleArrayValue(
                                editingPreset.allowedPlatformMaterials,
                                mat,
                                (arr) =>
                                  setEditingPreset({
                                    ...editingPreset,
                                    allowedPlatformMaterials: arr as PlatformMaterial[],
                                  })
                              )
                            }
                          />
                          <span className="text-sm">{PLATFORM_LABELS[mat]}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Allowed Railing Styles */}
                  <div className="space-y-2">
                    <Label>Erlaubte Geländerarten</Label>
                    <div className="space-y-1">
                      {RAILING_STYLES.map((style) => (
                        <label key={style} className="flex items-center gap-2 cursor-pointer">
                          <Checkbox
                            checked={editingPreset.allowedRailingStyles.includes(style)}
                            onCheckedChange={() =>
                              handleToggleArrayValue(
                                editingPreset.allowedRailingStyles,
                                style,
                                (arr) =>
                                  setEditingPreset({
                                    ...editingPreset,
                                    allowedRailingStyles: arr as RailingStyle[],
                                  })
                              )
                            }
                          />
                          <span className="text-sm">{RAILING_LABELS[style]}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Allowed Frame Materials */}
                  <div className="space-y-2">
                    <Label>Erlaubte Gestell-Materialien</Label>
                    <div className="space-y-1">
                      {FRAME_MATERIALS.map((mat) => (
                        <label key={mat} className="flex items-center gap-2 cursor-pointer">
                          <Checkbox
                            checked={editingPreset.allowedFrameMaterials.includes(mat)}
                            onCheckedChange={() =>
                              handleToggleArrayValue(
                                editingPreset.allowedFrameMaterials,
                                mat,
                                (arr) =>
                                  setEditingPreset({
                                    ...editingPreset,
                                    allowedFrameMaterials: arr as FrameMaterial[],
                                  })
                              )
                            }
                          />
                          <span className="text-sm">{FRAME_LABELS[mat]}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-4 border-t">
                    <Button className="flex-1" disabled>
                      <Save className="h-4 w-4 mr-2" />
                      Speichern
                    </Button>
                    <Button variant="outline" asChild>
                      <Link to={`/c/${selectedManufacturer}/${selectedPreset}`}>
                        <Eye className="h-4 w-4 mr-2" />
                        Vorschau
                      </Link>
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground text-center">
                    Speichern wird in Zukunft über Datenbank gesteuert
                  </p>
                </div>
              ) : (
                <p className="text-muted-foreground text-sm text-center py-8">
                  Wähle ein Preset zum Bearbeiten
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Links */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Schnellzugriff - Konfigurator-Links</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {presets.map((p) => {
                const manufacturer = manufacturers.find((m) => m.id === p.manufacturerId);
                return (
                  <Link
                    key={p.id}
                    to={`/c/${manufacturer?.slug}/${p.id}`}
                    className="p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 transition-colors"
                  >
                    <div className="text-xs text-muted-foreground">{manufacturer?.name}</div>
                    <div className="font-medium">{p.name}</div>
                  </Link>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminPage;
