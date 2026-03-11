# DNS: Connect GoDaddy domain to Vercel

Use this to point **davidlong.tech** (registered at GoDaddy) to your Vercel project.

---

## 1. Get the DNS information from Vercel

1. Open the [Vercel Dashboard](https://vercel.com/dashboard).
2. Open your **project** (e.g. the davidlong.tech deployment).
3. In the left sidebar: **Settings** → **Domains**.
4. Add **both** domains (so you get both an A and a CNAME):
   - Click **Add** and enter **davidlong.tech** → Add.
   - Click **Add** again and enter **www.davidlong.tech** → Add.
5. On the Domains page, the **DNS Records** section shows one row per domain:
   - For **davidlong.tech** (apex): you’ll see **A**, Value **76.76.21.21**. The “Name” column may say “subdomain” or “@”—that’s for the *root* domain. In GoDaddy you use **@** as the name.
   - For **www.davidlong.tech**: you should see **CNAME** and a target (e.g. **cname.vercel-dns.com**). If you only added the apex, add **www.davidlong.tech** as above to get this row.

**If no CNAME row appears** after adding www.davidlong.tech, use the standard Vercel target in GoDaddy anyway: **cname.vercel-dns.com** (see table below). If Vercel shows a TXT record for verification, add that in GoDaddy too.

---

## 2. Add those records in GoDaddy

1. Log in at [GoDaddy](https://www.godaddy.com).
2. **My Products** → find **davidlong.tech** → **DNS** or **Manage DNS**.
3. Add or edit records to match what Vercel shows. Typical setup:

   | Type    | Name / Host   | Value / Points to              | TTL       |
   |---------|---------------|---------------------------------|-----------|
   | **A**   | **@** (root)  | **76.76.21.21**                 | 600 or 1h |
   | **CNAME** | **www**     | **cname.vercel-dns.com**       | 600 or 1h |

   - **@** = root domain (davidlong.tech). If an A record for @ already exists, edit it to **76.76.21.21**.
   - For **www**, add a CNAME: Name = **www**, Value = the target Vercel gives you (often **cname.vercel-dns.com**).

4. Save. Changes can take a few minutes up to 24–48 hours to propagate.
5. In Vercel **Settings → Domains**, the domain will show **Valid Configuration** when DNS is correct; Vercel will then enable HTTPS.

---

## Summary

- **Vercel:** Project → **Settings** → **Domains** → add domain → copy the A and CNAME (and TXT if shown).
- **GoDaddy:** **My Products** → **davidlong.tech** → **DNS** → add A for @ and CNAME for www with those values.
