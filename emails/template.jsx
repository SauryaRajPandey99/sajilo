import {
  Html,
  Head,
  Body,
  Preview,
  Container,
  Heading,
  Text,
  Section,
} from "@react-email/components";
import * as React from "react";

export default function EmailTemplate({
  // userName = "Saurya Pandey",
  // type = "monthly-alert",
  // data = {
  //   month: "December",
  //   stats: {
  //     totalIncome: 5000,
  //     totalExpenses: 3500,
  //     byCategory: {
  //       housing: 1500,
  //       groceries: 600,
  //       transportation: 400,
  //       entertainment: 300,
  //       utilities: 700,
  //     },
  //   },
  //   insights: [
  //     "Your housing expenses are 43% of your total spending - consider reviewing your housing costs.",
  //     "Great job keeping entertainment expenses under control this month!",
  //     "Setting up automatic savings could help you save 20% more of your income.",
  //   ],
  // },

  userName = "",
  type = "monthly-alert",
  data = {},

  // testing data:
}) {
  if (type === "monthly-alert") {
    return (
      <Html>
        <Head />
        <Preview>Your Monthly Financial Report</Preview>
        <Body style={style.body}>
          <Container style={style.container}>
            <Heading style={style.title}>Monthly Financial Report</Heading>

            <Text style={style.text}>Hello {userName},</Text>
            <Text style={style.text}>
              Here&rsquo;s your financial summary for {data?.month}:
            </Text>

            {/* Main Stats */}
            <Section style={style.statsContainer}>
              <div style={style.stat}>
                <Text style={style.text}>Total Income</Text>
                <Text style={style.heading}>${data?.stats.totalIncome}</Text>
              </div>
              <div style={style.stat}>
                <Text style={style.text}>Total Expenses</Text>
                <Text style={style.heading}>${data?.stats.totalExpenses}</Text>
              </div>
              <div style={style.stat}>
                <Text style={style.text}>Net</Text>
                <Text style={style.heading}>
                  ${data?.stats.totalIncome - data?.stats.totalExpenses}
                </Text>
              </div>
            </Section>

            {/* Category Breakdown */}
            {data?.stats?.byCategory && (
              <Section style={style.section}>
                <Heading style={style.heading}>Expenses by Category</Heading>
                {Object.entries(data?.stats.byCategory).map(
                  ([category, amount]) => (
                    <div key={category} style={style.row}>
                      <Text style={{ ...style.text, margin: 0 }}>
                        {category}
                      </Text>
                      <Text style={{ ...style.text, margin: 0 }}>
                        ${amount}
                      </Text>
                    </div>
                  ),
                )}
              </Section>
            )}

            {/* AI Insights */}
            {data?.insights && (
              <Section style={style.section}>
                <Heading style={style.heading}>Sajilo Insights</Heading>
                {data.insights.map((insight, index) => (
                  <Text key={index} style={style.text}>
                    • {insight}
                  </Text>
                ))}
              </Section>
            )}

            <Text style={style.footer}>
              Thank you for using Sajilo. Keep tracking your finances for better
              financial health!
            </Text>
          </Container>
        </Body>
      </Html>
    );
  }
  if (type === "budget-alert") {
    return (
      <>
        <Html>
          <Head />
          <Preview>Budget Alert: Your budget is almost used up!</Preview>
          <Body style={style.body}>
            <Container style={style.container}>
              <Heading style={style.title}>Budget Alert</Heading>
              <Text style={style.text}> Hi {userName},</Text>
              <Text style={style.text}>
                We wanted to let you know that you've used{" "}
                <strong>{data?.percentageUsed.toFixed(1)}%</strong> of your
                budget for this month
              </Text>
              <Text style={style.text}>
                Please review your expenses and consider adjusting your spending
                to stay within your budget.
              </Text>
              <Text style={style.text}>
                Best regards,
                <br />
                The Sajilo Team
              </Text>
              <Section style={style.statsContainer}>
                <div style={style.stat}>
                  <Text style={style.text}>Budget Amount</Text>
                  <Text style={style.heading}>${data?.budgetAmount}</Text>
                </div>
                <div style={style.stat}>
                  <Text style={style.text}>Spent so far</Text>
                  <Text style={style.heading}>${data?.totalExpenses}</Text>
                </div>
                <div style={style.stat}>
                  <Text style={style.text}>Remaining </Text>
                  <Text style={style.heading}>
                    ${data?.budgetAmount - data?.totalExpenses}
                  </Text>
                </div>
              </Section>
            </Container>
          </Body>
        </Html>
      </>
    );
  }
}

// const style = {
//   body: {
//     backgroundColor: "#f4f4f4",
//     fontFamily:
//       "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
//     padding: "20px",
//   },
//   container: {
//     backgroundColor: "#ffffff",
//     borderRadius: "5px",
//     margin: "0 auto",
//     padding: "20px",
//     boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
//   },
//   title: {
//     color: "#333333",
//     fontSize: "32px",
//     fontWeight: "bold",
//     textAlign: "center",
//     margin: "0 0 20px",
//   },
//   heading: {
//     color: "#333333",
//     fontSize: "20px",
//     fontWeight: "600",
//     margin: "0 0 16px",
//   },
//   text: {
//     color: "#555555",
//     fontSize: "16px",
//     lineHeight: "1.5",
//     margin: "0 0 16px",
//   },
//   statsContainer: {
//     margin: "32px 0",
//     padding: "20px",
//     backgroundColor: "#f9f9f9",
//     borderRadius: "5px",
//   },
//   stat: {
//     marginBottom: "16px",
//     padding: "12px",
//     backgroundColor: "#ffffff",
//     borderRadius: "5px",
//     boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
//   },
// };

const style = {
  body: {
    backgroundColor: "#f6f9fc",
    fontFamily: "-apple-system, sans-serif",
  },
  container: {
    backgroundColor: "#ffffff",
    margin: "0 auto",
    padding: "20px",
    borderRadius: "5px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  title: {
    color: "#1f2937",
    fontSize: "32px",
    fontWeight: "bold",
    textAlign: "center",
    margin: "0 0 20px",
  },
  heading: {
    color: "#1f2937",
    fontSize: "20px",
    fontWeight: "600",
    margin: "0 0 16px",
  },
  text: {
    color: "#4b5563",
    fontSize: "16px",
    margin: "0 0 16px",
  },
  section: {
    marginTop: "32px",
    padding: "20px",
    backgroundColor: "#f9fafb",
    borderRadius: "5px",
    border: "1px solid #e5e7eb",
  },
  statsContainer: {
    margin: "32px 0",
    padding: "20px",
    backgroundColor: "#f9fafb",
    borderRadius: "5px",
  },
  stat: {
    marginBottom: "16px",
    padding: "12px",
    backgroundColor: "#fff",
    borderRadius: "4px",
    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    padding: "12px 8px",
    borderBottom: "1px solid #e5e7eb",
  },
  footer: {
    color: "#6b7280",
    fontSize: "14px",
    textAlign: "center",
    marginTop: "32px",
    paddingTop: "16px",
    borderTop: "1px solid #e5e7eb",
  },
};
