{
  description = "openapi-hooks devshell";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = {
    self,
    nixpkgs,
    flake-utils,
  }:
    flake-utils.lib.eachDefaultSystem (system: let
      pkgs = import nixpkgs {
        inherit system;
      };
    in {
      devShells = {
        default = pkgs.mkShell {
          packages = with pkgs; [
            nodejs_24
            pnpm_11
          ];

          shellHook = ''
            just
          '';
        };
      };
    });
}
