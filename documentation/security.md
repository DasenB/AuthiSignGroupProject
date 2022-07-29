# Attack vectors for the CA
The server of the certifying authority can be vulnerable to various attacks.  
| Attack | Description |
|:---:|---|
| Man in the Middle  | An attacker impersonates a trusted third party. |
| On-Demand Certificates | Developers/Administrators forget to delete on-demand certificates for easier developement. | 
| Expired Certificates | Certificates for the server does not get renewed. | 
| Renegotiation Vulnerability | Renegotiation provides authentication data for existing connections instead of closing and opening a new one. | 
| Insider Attack | An inside attack with authorized system access using it for malicious intend. |
| Network Attack | An attacker suppresses or modifies packets for certain effects.| 