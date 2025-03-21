
import { useState } from "react";
import { useICP } from "@/contexts/ICPContext";
import { ButtonCustom } from "./button-custom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./dialog";
import { Input } from "./input";
import { Label } from "./label";
import { LogIn, LogOut, Settings, Save } from "lucide-react";
import { ICPCanisterIds } from "@/types/prescription";
import { toast } from "sonner";

export const ICPConnect = () => {
  const { isConnected, connect, disconnect, canisterIds, updateCanisterIds, isLoading } = useICP();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [localCanisterIds, setLocalCanisterIds] = useState<ICPCanisterIds>({...canisterIds});

  const handleConnect = async () => {
    const success = await connect();
    if (!success) {
      toast.error("Failed to connect to Internet Computer");
    }
  };

  const handleDisconnect = async () => {
    await disconnect();
  };

  const handleSaveSettings = () => {
    updateCanisterIds(localCanisterIds);
    setIsSettingsOpen(false);
    toast.success("ICP canister settings updated");
  };

  const handleCanisterIdChange = (key: keyof ICPCanisterIds, value: string) => {
    setLocalCanisterIds((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div className="flex items-center gap-2">
      {isConnected ? (
        <>
          <ButtonCustom
            variant="outline"
            size="sm"
            onClick={handleDisconnect}
            disabled={isLoading}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Disconnect ICP
          </ButtonCustom>
          
          <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
            <DialogTrigger asChild>
              <ButtonCustom variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </ButtonCustom>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>ICP Canister Settings</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="patientsCanister">Patients Canister ID</Label>
                  <Input
                    id="patientsCanister"
                    value={localCanisterIds.patientsCanister}
                    onChange={(e) => handleCanisterIdChange('patientsCanister', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="doctorsCanister">Doctors Canister ID</Label>
                  <Input
                    id="doctorsCanister"
                    value={localCanisterIds.doctorsCanister}
                    onChange={(e) => handleCanisterIdChange('doctorsCanister', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="prescriptionsCanister">Prescriptions Canister ID</Label>
                  <Input
                    id="prescriptionsCanister"
                    value={localCanisterIds.prescriptionsCanister}
                    onChange={(e) => handleCanisterIdChange('prescriptionsCanister', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="testsCanister">Tests Canister ID</Label>
                  <Input
                    id="testsCanister"
                    value={localCanisterIds.testsCanister}
                    onChange={(e) => handleCanisterIdChange('testsCanister', e.target.value)}
                  />
                </div>
                
                <ButtonCustom 
                  className="w-full" 
                  onClick={handleSaveSettings}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Settings
                </ButtonCustom>
              </div>
            </DialogContent>
          </Dialog>
        </>
      ) : (
        <ButtonCustom
          variant="outline"
          size="sm"
          onClick={handleConnect}
          disabled={isLoading}
        >
          <LogIn className="h-4 w-4 mr-2" />
          Connect to ICP
        </ButtonCustom>
      )}
    </div>
  );
};
