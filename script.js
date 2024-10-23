<script>
    // Store for tab URLs
    let tabs = [{ url: '' }];
    let currentTabIndex = 0;

    // Load the page or search based on input
    function loadPage() {
        const input = document.getElementById("urlInput").value.trim();
        let url;

        // Check if input is a valid URL
        if (input.startsWith('http://') || input.startsWith('https://')) {
            url = input;
        } else if (input.includes('.')) {
            url = `https://${input}`;
        } else {
            // Redirect to Google search for queries
            url = `https://www.google.com/search?q=${encodeURIComponent(input)}`;
        }

        tabs[currentTabIndex].url = url;
        document.getElementById("browser").src = url;

        // Error handling for refused connections (site blocking iframe)
        document.getElementById("browser").onload = function() {
            checkIframeLoaded();
        };
    }

    // Check if the iframe content is blocked
    function checkIframeLoaded() {
        const iframe = document.getElementById("browser");
        try {
            const iframeContent = iframe.contentWindow || iframe.contentDocument;
            if (iframeContent.document) {
                // If we can access the content, everything is fine
                console.log("Iframe loaded successfully");
            }
        } catch (error) {
            // If an error occurs, the site is likely blocking the iframe
            console.error("Site refused to connect in iframe", error);
            alert("This site does not allow embedding. Opening in a new tab.");
            window.open(tabs[currentTabIndex].url, '_blank');
        }
    }

    // Switch between tabs
    function switchTab(index) {
        currentTabIndex = index;
        const iframe = document.getElementById("browser");
        iframe.src = tabs[index].url;
        updateActiveTab();
    }

    // Add a new tab
    function addTab() {
        tabs.push({ url: '' });
        currentTabIndex = tabs.length - 1;
        updateTabs();
        loadPage(); // Load empty tab
    }

    // Update the tab buttons dynamically
    function updateTabs() {
        const tabContainer = document.getElementById('tabs');
        tabContainer.innerHTML = '';

        // Create tab buttons
        tabs.forEach((tab, index) => {
            const tabButton = document.createElement('div');
            tabButton.className = 'tab';
            tabButton.textContent = `Tab ${index + 1}`;
            tabButton.onclick = () => switchTab(index);
            tabContainer.appendChild(tabButton);
        });

        // Add "New Tab" button
        const newTabButton = document.createElement('div');
        newTabButton.className = 'tab';
        newTabButton.textContent = '+ New Tab';
        newTabButton.onclick = addTab;
        tabContainer.appendChild(newTabButton);

        updateActiveTab();
    }

    // Highlight the active tab
    function updateActiveTab() {
        const tabs = document.querySelectorAll('.tab');
        tabs.forEach((tab, index) => {
            tab.classList.toggle('active', index === currentTabIndex);
        });
    }

    // Initial update for tabs
    updateTabs();
</script>
