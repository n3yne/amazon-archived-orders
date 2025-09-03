# Amazon Archived Orders Restoration

Tampermonkey userscript that restores the **Archived Orders** functionality on [Amazon.com](https://www.amazon.com).

✨ Features:
- Restores the missing **"Archived Orders"** tab at the top of the *Your Orders* page.
- Adds an **"Archive Order"** link next to each order (next to "View order details" and "View invoice"), which opens Amazon’s hidden archive modal for that order.

---

## Installation

1. Install a userscript manager extension:
   - [Tampermonkey](https://www.tampermonkey.net/) (recommended)
   - or [Violentmonkey](https://violentmonkey.github.io/)

2. Click this link to install the script directly:  
   👉 [**Install Amazon Archived Orders Enhancer**](https://github.com/n3yne/amazon-archived-orders/raw/refs/heads/main/Amazon_Archived_Orders_Restoration.user.js)

3. Open the [Amazon Your Orders page](https://www.amazon.com/gp/your-account/order-history).  
   You should now see:
   - An **Archived Orders** tab next to "Cancelled Orders".
   - An **Archive Order** link on each order row.

---

## Notes

- This script depends on Amazon’s current internal archive URLs, which are still active but may be removed by Amazon at any time.  
- If those endpoints are disabled in the future, this script will no longer function.  

---

## Development

If you’d like to contribute:
1. Fork this repo
2. Make your changes
3. Submit a pull request
