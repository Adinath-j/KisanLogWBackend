document.addEventListener("DOMContentLoaded", async () => {
  const tabs = document.querySelectorAll(".tab");
  const tabContent = document.getElementById("tabContent");

  // ------------------------------------------------------
  // 1. SESSION CHECK (DEBUG MODE)
  // ------------------------------------------------------
  console.log("🔍 DASHBOARD: Starting Session Check...");

  if (!window.SharedStorage || !window.SharedStorage.checkSession) {
    console.error("❌ CRITICAL: SharedStorage not loaded. Check script order in index.html.");
    alert("System Error: SharedStorage missing.");
    return;
  }

  const user = await window.SharedStorage.checkSession();
  console.log("👤 DASHBOARD: User received from backend:", user);

  if (!user) {
    console.error("⛔ ACCESS DENIED: Backend returned null user.");
    console.warn("⚠️ I am NOT redirecting you yet so you can see this error.");
    console.warn("⚠️ Normally, I would send you to ../login.html now.");

    // TEMPORARY: Show error on screen instead of redirecting
    document.body.innerHTML = `
        <div style="color: red; text-align: center; margin-top: 50px;">
            <h1>Access Denied</h1>
            <p>The Dashboard cannot read your login session.</p>
            <p><strong>Open Console (F12) to see details.</strong></p>
            <p><a href="../login.html">Click here to go back to Login manually</a></p>
        </div>
      `;
    return;
  }

  // ------------------------------------------------------
  // 2. INITIALIZE DASHBOARD UI
  // ------------------------------------------------------
  const welcomeText = document.getElementById("welcomeText");
  if (welcomeText) welcomeText.textContent = `Welcome, ${user.fullName}! 👋`;

  window.logoutUser = window.SharedStorage.logout;

  try {
    const allData = await window.SharedStorage.loadAll();
    window.expenses = allData.expenses;
    window.yields = allData.yields;
  } catch (err) {
    console.error("Failed to load data", err);
  }

  // ------------------------------------------------------
  // 3. SET DEFAULT TAB -> ANALYSIS
  // ------------------------------------------------------
  // Check if analysis.html actually exists in your folder!
  console.log("📂 Loading Analysis Tab...");
  loadTab("analysis.html", "../assets/js/analysis.js", "analysis");

  document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
  const analysisTabBtn = document.querySelector('.tab[data-tab="analysis.html"]');
  if (analysisTabBtn) analysisTabBtn.classList.add("active");

  // ------------------------------------------------------
  // 4. TAB CLICK LOGIC
  // ------------------------------------------------------
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
      tab.classList.add("active");

      const tabName = tab.dataset.tab.replace(".html", "");
      const jsPath = `../assets/js/${tabName}.js`;
      loadTab(tab.dataset.tab, jsPath, tabName);
    });
  });

  // HELPER: TAB LOADER
  function loadTab(page, scriptPath, tabName) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', page, true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          tabContent.innerHTML = xhr.responseText;
          const oldScript = document.getElementById("dynamicTabScript");
          if (oldScript) oldScript.remove();

          const script = document.createElement("script");
          script.src = scriptPath;
          script.id = "dynamicTabScript";
          script.onload = () => requestAnimationFrame(() => renderTab(tabName));
          document.body.appendChild(script);
        } else {
          console.error(`❌ Failed to load tab: ${page} (Status: ${xhr.status})`);
          tabContent.innerHTML = `<p style="color:red; text-align:center;">Error loading ${page}. Does the file exist?</p>`;
        }
      }
    };
    xhr.send();
  }

  // HELPER: RENDER CONTENT
  function renderTab(tabName) {
    if (tabName === "expenses" && window.renderExpensesTable) renderExpensesTable();
    else if (tabName === "yields" && window.renderYieldsTable) renderYieldsTable();
    else if (tabName === "analysis" && window.renderAnalysisTable) renderAnalysisTable();
    else if (tabName === "graphs" && window.renderCharts) renderCharts();
  }

  // ------------------------------------------------------
  // CSV EXPORT FUNCTION
  // ------------------------------------------------------
  window.exportToCSV = function () {
    try {
      // Get current data
      const expenses = window.expenses || [];
      const yields = window.yields || [];
      const analysis = window.SharedStorage ? window.SharedStorage.getCropAnalysis(expenses, yields) : [];

      // Build CSV content
      let csv = "KisanLog - Comprehensive Report\n";
      csv += `Generated on: ${new Date().toLocaleString()}\n\n`;

      // EXPENSES SECTION
      csv += "=== EXPENSES ===\n";
      csv += "Date,Crop,Category,Description,Amount\n";
      expenses.forEach(e => {
        const date = e.date ? new Date(e.date).toLocaleDateString() : '-';
        const crop = (e.crop || '').replace(/,/g, ';'); // Replace commas to avoid CSV issues
        const category = (e.category || '').replace(/,/g, ';');
        const description = (e.description || '').replace(/,/g, ';');
        const amount = e.amount || 0;
        csv += `${date},${crop},${category},${description},${amount}\n`;
      });

      // Calculate total expenses
      const totalExpenses = expenses.reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);
      csv += `\nTotal Expenses:,,,₹${totalExpenses.toFixed(2)}\n\n`;

      // YIELDS SECTION
      csv += "=== YIELDS ===\n";
      csv += "Date,Crop,Quantity,Unit,Price Per Unit,Total Revenue\n";
      yields.forEach(y => {
        const date = y.date ? new Date(y.date).toLocaleDateString() : '-';
        const crop = (y.crop || '').replace(/,/g, ';');
        const quantity = y.quantity || 0;
        const unit = y.unit || '';
        const pricePerUnit = y.pricePerUnit || 0;
        const totalRevenue = y.totalRevenue || 0;
        csv += `${date},${crop},${quantity},${unit},${pricePerUnit},${totalRevenue}\n`;
      });

      // Calculate total revenue
      const totalRevenue = yields.reduce((sum, y) => sum + (parseFloat(y.totalRevenue) || 0), 0);
      csv += `\nTotal Revenue:,,,,,₹${totalRevenue.toFixed(2)}\n\n`;

      // ANALYSIS SECTION
      csv += "=== CROP PROFITABILITY ANALYSIS ===\n";
      csv += "Crop,Total Expenses,Total Revenue,Net Profit,Profit Margin %\n";
      analysis.forEach(c => {
        const crop = (c.crop || '').replace(/,/g, ';');
        const margin = c.revenue > 0 ? ((c.profit / c.revenue) * 100).toFixed(1) : 0;
        csv += `${crop},${c.expenses.toFixed(2)},${c.revenue.toFixed(2)},${c.profit.toFixed(2)},${margin}%\n`;
      });

      // Summary
      const netProfit = totalRevenue - totalExpenses;
      csv += `\n=== SUMMARY ===\n`;
      csv += `Total Expenses:,₹${totalExpenses.toFixed(2)}\n`;
      csv += `Total Revenue:,₹${totalRevenue.toFixed(2)}\n`;
      csv += `Net Profit:,₹${netProfit.toFixed(2)}\n`;

      // Create download link
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);

      link.setAttribute('href', url);
      link.setAttribute('download', `Farm_Report_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      console.log('✅ CSV Report exported successfully');
    } catch (error) {
      console.error('❌ Error exporting CSV:', error);
      alert('Error exporting report. Please try again.');
    }
  };
});