// Define the AssessmentDashboard component
const AssessmentDashboard = () => {
    // Use React hooks with the React prefix since we're not importing React
    const [selectedSection, setSelectedSection] = React.useState(null);
    const [assessmentResponses, setAssessmentResponses] = React.useState({});
    const [showResults, setShowResults] = React.useState(false);
    const [dialogOpen, setDialogOpen] = React.useState(false);
  
    const sections = [
      {
        title: "Legislative Indicators",
        icon: "📜",
        description: "Assessment of climate-related laws and their implementation",
        questions: [
          {
            id: "leg1",
            text: "Number of Climate-Related Laws Enacted",
            options: ["Very Low", "Low", "Medium", "High", "Very High"]
          },
          {
            id: "leg2",
            text: "Quality of Legislation",
            options: ["Poor", "Fair", "Good", "Very Good", "Excellent"]
          }
        ]
      },
      {
        title: "Financial Indicators",
        icon: "💰",
        description: "Evaluation of budget allocation and financial management",
        questions: [
          {
            id: "fin1",
            text: "Total Public Investment in Climate Initiatives",
            options: ["Very Low", "Low", "Medium", "High", "Very High"]
          },
          {
            id: "fin2",
            text: "Percentage of National Budget",
            options: ["<1%", "1-3%", "3-5%", "5-10%", ">10%"]
          }
        ]
      },
      {
        title: "Governance Indicators",
        icon: "⚖️",
        description: "Analysis of stakeholder engagement and policy implementation",
        questions: [
          {
            id: "gov1",
            text: "Stakeholder Consultation Processes",
            options: ["Limited", "Basic", "Moderate", "Comprehensive", "Extensive"]
          },
          {
            id: "gov2",
            text: "Transparency of Budget Processes",
            options: ["Low", "Medium-Low", "Medium", "Medium-High", "High"]
          }
        ]
      }
    ];
  
    const handleResponse = (questionId, value) => {
      setAssessmentResponses(prev => ({
        ...prev,
        [questionId]: value
      }));
    };
  
    const getChartData = () => {
      return Object.entries(assessmentResponses).map(([key, value]) => {
        // Find the section and question that this response belongs to
        for (const section of sections) {
          const question = section.questions.find(q => q.id.toString() === key);
          if (question) {
            return {
              name: question.text,
              score: question.options.indexOf(value) + 1
            };
          }
        }
        return {
          name: `Question ${key}`,
          score: 0
        };
      });
    };
  
    // Simple Bar Chart Component
    const renderBarChart = (data) => {
      if (!data || data.length === 0) {
        return <p>No assessment data available</p>;
      }
  
      return (
        <div style={{ fontFamily: 'Arial, sans-serif', padding: '10px' }}>
          {data.map((item, index) => (
            <div key={index} style={{ marginBottom: '15px' }}>
              <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>{item.name}</div>
              <div style={{ 
                height: '25px', 
                backgroundColor: '#f0f0f0', 
                borderRadius: '4px',
                marginBottom: '5px',
                position: 'relative'
              }}>
                <div style={{ 
                  width: `${(item.score / 5) * 100}%`, 
                  height: '100%', 
                  backgroundColor: '#008751',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  paddingRight: '8px',
                  color: 'white'
                }}>
                  {item.score}
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    };
  
    return (
      <div className="container py-4">
        <h1 className="text-center mb-2">PROPOSED INDICATORS FOR PARLIAMENTS IN</h1>
        <h2 className="text-center mb-4">MONITORING EFFECTIVENESS AND EFFICIENCY OF CLIMATE POLICY IMPLEMENTATION</h2>
        
        <div className="row">
          {sections.map((section) => (
            <div key={section.title} className="col-md-4 mb-4">
              <div className="card h-100">
                <div className="card-header">
                  <h3 className="card-title">
                    <span style={{ marginRight: '10px' }}>{section.icon}</span>
                    {section.title}
                  </h3>
                </div>
                <div className="card-body">
                  <p className="text-muted mb-4">{section.description}</p>
                  <button 
                    className="btn btn-primary btn-block" 
                    onClick={() => {
                      setSelectedSection(section);
                      setDialogOpen(true);
                    }}
                  >
                    Start Assessment
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
  
        {showResults && (
          <div className="row mt-4">
            <div className="col-12">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Assessment Results</h3>
                </div>
                <div className="card-body">
                  {renderBarChart(getChartData())}
                </div>
              </div>
            </div>
          </div>
        )}
  
        {dialogOpen && selectedSection && (
          <div className="modal fade show" tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-lg" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">{selectedSection.title} Assessment</h5>
                  <button type="button" className="close" onClick={() => setDialogOpen(false)}>
                    <span>&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  {selectedSection.questions.map((question) => (
                    <div key={question.id} className="form-group">
                      <label><strong>{question.text}</strong></label>
                      <select 
                        className="form-control" 
                        value={assessmentResponses[question.id] || ''}
                        onChange={(e) => handleResponse(question.id, e.target.value)}
                      >
                        <option value="">Select an option</option>
                        {question.options.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={() => setDialogOpen(false)}
                  >
                    Close
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-primary"
                    onClick={() => {
                      setShowResults(true);
                      setDialogOpen(false);
                    }}
                  >
                    Submit Assessment
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };
  
  // For debugging
  console.log("AssessmentDashboard component defined");
  
  // Render the React component into the DOM
  document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM Content Loaded");
    const container = document.getElementById('assessment-dashboard');
    
    if (container) {
      console.log("Container found, rendering React component");
      ReactDOM.render(React.createElement(AssessmentDashboard), container);
    } else {
      console.error('Container element with ID "assessment-dashboard" not found!');
    }
  });