Unicode true
SetCompressor /SOLID lzma
Name "Pasapalabra en familia 1.0"
OutFile "PasapalabraEnFamilia-1.0-Windows-Setup.exe"
InstallDir "$LOCALAPPDATA\Programs\PasapalabraEnFamilia"
RequestExecutionLevel user
!include "MUI2.nsh"
!insertmacro MUI_PAGE_WELCOME
!insertmacro MUI_PAGE_DIRECTORY
!insertmacro MUI_PAGE_INSTFILES
!insertmacro MUI_PAGE_FINISH
!insertmacro MUI_UNPAGE_CONFIRM
!insertmacro MUI_UNPAGE_INSTFILES
!insertmacro MUI_LANGUAGE "Spanish"
Section
  SetOutPath "$INSTDIR"
  File /r "dist\win-unpacked\*"
  WriteUninstaller "$INSTDIR\Desinstalar.exe"
  CreateShortcut "$DESKTOP\Pasapalabra en familia.lnk" "$INSTDIR\Pasapalabra en familia.exe"
  CreateDirectory "$SMPROGRAMS\Pasapalabra en familia"
  CreateShortcut "$SMPROGRAMS\Pasapalabra en familia\Pasapalabra en familia.lnk" "$INSTDIR\Pasapalabra en familia.exe"
  WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\PasapalabraEnFamilia" "DisplayName" "Pasapalabra en familia"
  WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\PasapalabraEnFamilia" "Publisher" "Ikeriano"
  WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\PasapalabraEnFamilia" "UninstallString" "$INSTDIR\Desinstalar.exe"
SectionEnd
Section "Uninstall"
  Delete "$DESKTOP\Pasapalabra en familia.lnk"
  RMDir /r "$SMPROGRAMS\Pasapalabra en familia"
  DeleteRegKey HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\PasapalabraEnFamilia"
  RMDir /r "$INSTDIR"
SectionEnd
