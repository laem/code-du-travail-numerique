import React from "react";
import PropTypes from "prop-types";
import { Container, Section } from "@cdt/ui";
import { PrevNextStepper } from "../PrevNextStepper";
import { labelStyle, radioContainerStyle } from "../stepStyles";

class LicenciementEco extends React.Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    value: PropTypes.bool,
    onPrevious: PropTypes.func.isRequired,
    onNext: PropTypes.func.isRequired,
    nextDisabled: PropTypes.bool
  };
  static defaultProps = {
    value: false,
    nextDisabled: false
  };

  render() {
    const { onChange, value, onPrevious, onNext, nextDisabled } = this.props;

    return (
      <React.Fragment>
        <Section light>
          <React.Fragment>
            <h2>Est ce que le motif de votre licenciement est économique ?</h2>
            <div style={radioContainerStyle}>
              <label style={labelStyle}>
                <input
                  type="radio"
                  onChange={() => onChange(true)}
                  name="affiliation"
                  checked={value === true}
                />{" "}
                Oui
              </label>
              <label style={labelStyle}>
                <input
                  type="radio"
                  onChange={() => onChange(false)}
                  name="affiliation"
                  checked={value === false}
                />{" "}
                Non
              </label>
            </div>
          </React.Fragment>
        </Section>
        <Container>
          <PrevNextStepper
            onPrev={onPrevious}
            onNext={onNext}
            nextDisabled={nextDisabled}
          />
        </Container>
      </React.Fragment>
    );
  }
}

export { LicenciementEco };
