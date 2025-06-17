window.addEventListener("DOMContentLoaded", () => {
    particlesJS.load('particles-js', 'particles.json', function() {
        console.log('Particles initialized');
      });
  class Clampify {
    constructor() {
      // Accessing all required elements
      this.defaultModeSwitcherBtn = document.querySelector(".calculation-mode-toggle > .default-mode-btn");
      this.customModeSwitcherBtn = document.querySelector(".calculation-mode-toggle > .custom-mode-btn");

      this.formResetBtn = document.querySelector("form.clamp-calculate .reset");
      this.calculateBtn = document.querySelector("form.clamp-calculate .calculate-btn");

      this.minValue = document.querySelector("form.clamp-calculate #min-value");
      this.maxValue = document.querySelector("form.clamp-calculate #max-value");

      this.selectedUnit = document.querySelector("select#unit");

      this.minMaxVwFieldsetWrapper = document.querySelector("#min-max-viewport-input");

      this.customMinVw = document.querySelector(".clamp-calculate #min-vw");
      this.customMaxVw = document.querySelector(".clamp-calculate #max-vw");

      this.defaultMinVw = 320;
      this.defaultMaxVw = 1920;

      this.outputWrapper = document.querySelector("form.clamp-calculate .output-wrapper");
      this.copyBtn = document.querySelector('.output-wrapper button');
      this.init();
    }

    init() {
    
      // mode switcher btns event listener
      this.defaultModeSwitcherBtn.addEventListener("click", () => {
        this.defaultModeSwitcherBtn.classList.add("active");
        this.customModeSwitcherBtn.classList.remove("active");
        this.modeSwitch("default");
      });

      this.customModeSwitcherBtn.addEventListener("click", () => {
        this.defaultModeSwitcherBtn.classList.remove("active");
        this.customModeSwitcherBtn.classList.add("active");
        this.modeSwitch("custom");
      });

      // Form reset btn event listener
      this.formResetBtn.addEventListener("click", (e) => {
        e.preventDefault();
        this.resetForm();
         this.selectedUnit.value = 'px';
         this.resetUnitInLabel();
      });

      // Calculate btn event listener
      this.calculateBtn.addEventListener('click',(e)=>{
        e.preventDefault();
        this.calculateClamp();
      })

      // On change of unit, resetting form
      this.selectedUnit.addEventListener('change',()=>{
        this.resetForm();
        this.resetUnitInLabel();
      })

      // Clamp code copy on copy btn click

      this.copyBtn?.addEventListener('click',(e)=>{
        e.preventDefault()
        this.copyText()
      })

    }

    // Resetting unit in label
    resetUnitInLabel(){
      let selectedValue = this.selectedUnit.value;
      document.querySelectorAll("label span").forEach(span => {
        span.innerText = "";
        span.innerText = selectedValue;
      });
    }

    // Method for resetting form
    resetForm() {

        this.minValue.value = '';
        this.maxValue.value = '';
        this.customMinVw.value = '';
        this.customMaxVw.value = '';
        this.outputWrapper.classList.add('d-none');
    }

    

    // Method to copy the output code in clipboard
    copyText() {
        navigator.clipboard.writeText(this.outputWrapper.querySelector('p').innerText).then(() => {
          alert("Clamp css code copied to your clipboard!");
        }).catch(err => {
          console.error("Failed to copy: ", err);
        });
    }

    // Method for calculating clamp code according to mode selected
    calculateClamp() {
      let minVw = this.defaultMinVw;
      let maxVw = this.defaultMaxVw;
       if(this.customMaxVw.value && this.customMinVw.value){
        minVw = this.customMinVw.value;
        maxVw = this.customMaxVw.value;
       }
       let minValue = this.minValue.value;
       let maxValue = this.maxValue.value;

       let selectedUnitValue = this.selectedUnit.value;

       if (minValue && maxValue) {
          if(selectedUnitValue == 'rem'){
            // converted inputted rem value into px
           minValue *= 16;
           maxValue *= 16;
          }
           let scope = ((maxValue - minValue) / (Number(maxVw) - Number(minVw))) * 100;
           let base = minValue - (scope / 100) * Number(minVw);
           let clampCode = `clamp(${minValue}px,calc(${Number(base.toFixed(3))}px + ${Number(scope.toFixed(3))}vw),${maxValue}px)`;
           if(selectedUnitValue == 'rem'){
            let baseValueInRem = base/16;
            let minValueInRem = minValue/16;
            let maxValueInRem = maxValue/16;
            clampCode = `clamp(${minValueInRem}rem,calc(${Number(baseValueInRem.toFixed(3))}rem + ${Number(scope.toFixed(3))}vw),${maxValueInRem}rem)`;
           }
           this.outputWrapper.classList.remove('d-none')
           this.outputWrapper.querySelector('p').innerText = clampCode;           
       }
    }

    // Method for form mode switch
    modeSwitch(mode) {
      if (mode == "default") {
        this.minMaxVwFieldsetWrapper.classList.add("d-none");
      } else {
        this.minMaxVwFieldsetWrapper.classList.remove("d-none");
      }
      this.resetForm();
      this.selectedUnit.value = 'px';
      this.resetUnitInLabel();
    }
  }

  let clampifyObj = new Clampify();
});
