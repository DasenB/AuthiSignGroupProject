# Test Cases

## Black-box tests (Use-Case testing)

The numbers in the labels of each testcase correspond to the number of each [Use-Case](https://github.com/clecap/authi-sign-lecture/blob/main/Requirements.md#use-cases).

### Authenticate with ORCID

| **TBU 01.A** | Steps | Expected Result |
|:---:|---|---|
|  | **Normal** |  |
| 1 | Enter username | User is able to enter username |
| 2 | Enter password | User is able to enter password |
| 3 | Send credentials | User succesfully logs in |

| **TBU 01.B** | Steps | Expected Result |
|:---:|---|---|
| | **Invalid ID/PW** |  |
| 1 | Repeat steps 1 and 2 from *T01.A* but with either wrong ID or PW |  |
| 2 | Send credentials | User sees an error message |

### Generate Key Pair

| **TBU 02.A** | Steps | Expected Result |
|:---:|---|---|
|  | **Normal** |  |
| 1 | Request key pair | Valid key pair is returned |

### Send Certificate Signing Request

| **TBU 03.A** | Steps | Expected Result |
|:---:|---|---|
|  | **Normal** |  |
| 1 | Send a CSR | User receives a signed certificate |

### Generate Comment Signature

| **TBU 06.A** | Steps | Expected Result |
|:---:|---|---|
|  | **Normal** |  |
| 1 | Write a comment | User is able to write a comment |
| 2 | Request Signature | Comment is signed with users PK and user is informed |

### Check Authenticity

| **TBU 07.A** | Steps | Expected Result |
|:---:|---|---|
|  | **Normal** |  |
| 1 | Click on *check authenticity* next to a comment  | User receives positive or negative response |

## Black-Box tests

### Creating comments

| **TB 01.A** | Steps | Expected Result |
|:---:|---|---|
|  | **Normal** |  |
| 1 | Go to a website that allows for commenting | User is is able to identify (in the extension) that he can or cannot write a comment |
| 2 | Write a comment | User is able to write a comment |
| 3 | Send comment | User can see that a signed comment was sent |

### View comments

| **TB 01.A** | Steps | Expected Result |
|:---:|---|---|
|  | **Normal** |  |
| 1 | Step 1 of TB 01.A |  |
| 2 | Retrieve comments | User is able to retrieve all comments that were posted to the website via the extension |



