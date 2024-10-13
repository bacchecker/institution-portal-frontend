import React, { Component } from 'react';

class DocumentTypes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: 'requests',
    };
  }

  // Switch tab function
  switchTab = (tab) => {
    this.setState({ activeTab: tab });
  };

  render() {
    const { activeTab } = this.state;

    return (
      <div className="p-6">
        {/* Tabs */}
        <div className="flex border-b border-gray-300">
          <button
            className={`px-4 py-2 font-semibold focus:outline-none transition-all duration-300 ${
              activeTab === 'requests'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600'
            }`}
            onClick={() => this.switchTab('requests')}
          >
            Document Requests
          </button>
          <button
            className={`ml-4 px-4 py-2 font-semibold focus:outline-none transition-all duration-300 ${
              activeTab === 'validations'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600'
            }`}
            onClick={() => this.switchTab('validations')}
          >
            Document Validations
          </button>
        </div>

        {/* Tab Content */}
        <div
          className={`mt-4 transition-opacity duration-500 ${
            activeTab === 'requests' ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {activeTab === 'requests' && (
            <div>
              <h2 className="text-xl font-bold">Document Requests</h2>
              <p>This is the content for document requests.</p>
            </div>
          )}
        </div>

        <div
          className={`mt-4 transition-opacity duration-500 ${
            activeTab === 'validations' ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {activeTab === 'validations' && (
            <div>
              <h2 className="text-xl font-bold">Document Validations</h2>
              <p>This is the content for document validations.</p>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default DocumentTypes;
