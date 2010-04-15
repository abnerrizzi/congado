<?php
/**
 * @package Helper
 */
/**
 * @package Helper
 */
//class Zend_View_Helper_Grid extends Zend_View_Helper_Abstract
/**
 * @package Helper
 * @author Abner S. A. Rizzi <abner.rizzi@gmail.com>
 */
class Zend_View_Helper_FormEdit
{

	public $view;

	public function setView(Zend_View_Interface $view)
	{
		$this->view = $view;
		return $this;
	}

	public function FormEdit(Zend_Form $form, $baseUrl = false, array $elements)
	{

		if ($form->getAttrib('enctype')) {
			$__enctype = ' enctype="'.$form->getAttrib('enctype').'"';
		} else {
			$__enctype = '';
		}
		$output = '
<br/><br/>
<form name="'.$form->getName().'" id="'.$form->getId().'" action="'. $baseUrl . $form->getAction().'" method="'.$form->getMethod().'" '.$__enctype.'>
';
		for ($i=0; $i < count($elements); $i++)
		{
			$_el = $form->getElement($elements[$i]);
			if (!$_el) {
				throw new Exception("Element (".$elements[$i].") not found in Zend_Form object");
			}
			if ($_el->getType() == 'Zend_Form_Element_Hidden') {
				$output .= $_el->removeDecorator('tag')->removeDecorator('label')->removeFilter('StringTrim');;
				continue;
			}
		}
		unset($i);
		$output .= '
<table
	id="form"
	align="center"
	border="0"
	cellpadding="0"
	cellspacing="0"
	bgcolor="#F7F6F4"
	class="content"
	style="	border-right: 1px solid #CCCCCC;
			border-bottom: 1px solid #CCCCCC;
			border-left: 1px solid #919191;
			font-size: 12px;">

  <tr
	style="background: url(\''.$baseUrl.'/images/grid/bg_title.gif\');">
	<td width="20" ></td>
	<td colspan="5" height="20" width="480" style="font-size: 11px;"><b>'.str_replace('_', ' ', strtoupper($form->getName())).'</b></td>
  </tr>

  <tr>
	<td height="2" bgcolor="#f36400" colspan="5"/>
  </tr>

';
		for ($i=0; $i < count($elements); $i++)
		{
			$_el = $form->getElement($elements[$i]);
			if ($_el->getType() == 'Zend_Form_Element_Hidden' || $_el->getName() == 'delete') {
				continue;
			}

			if (is_int($elementCity = strpos($_el->getName(), 'cidades_id'))) {

				if (is_int($elementCity)) {
					$_input  = $form->getElement(substr($_el->getName(),0,$elementCity).'uf')->removeDecorator('tag')->removeDecorator('label');
				} else {
					$_input  = $form->getElement('uf')->removeDecorator('tag')->removeDecorator('label');
				}

				$_input .= " - ";
				$_input .= $_el->removeDecorator('tag')->removeDecorator('label')->removeFilter('StringTrim');
			} else {
				$_input = $_el->removeDecorator('tag')->removeDecorator('label')->removeFilter('StringTrim');
			}
		
			$output .='
  <tr>
	<td height="10" colspan="5"> </td>
  </tr>
  <tr>
	<td width="20"></td>
	<td class="label">'.$_el->getLabel().':</td>
	<td width="10"></td>
	<td class="element">'.$_input.'</td>
	<td width="50"></td>
  </tr>
';
		}

		$output .= '

  <tr>
	<td height="10" colspan="5"/>
  </tr>

  <tr>
	<td width="20"></td>
';
		if (in_array('delete', $elements)) {
			$form->getElement('delete')->setAttrib('onclick', "check_delete(".$form->getElement('id')->getValue().", '".Zend_Controller_Front::getInstance()->getRequest()->getControllerName()."', '".$baseUrl."/".Zend_Controller_Front::getInstance()->getRequest()->getControllerName()."/delete');return false");
			$excluir = '
<span class="UIButton UIButton_Large UIFormButton  UIButton_Gray" onclick="'.$form->getElement('delete')->getAttrib('onclick').'">
<span class="UIIcon UIIcon_Delete">&nbsp;</span>
  <input style="display: inline-block;"  class="UIButton_Text" type="button" value="Excluir" name="'.$form->getElement('delete')->getName().'" id="'.$form->getElement('delete')->getId().'" onclick="'.$form->getElement('delete')->getAttrib('onclick').'"/>
</span>

			';
		} else {
			$excluir = '';
		}
	$output .= '
	<td align="center">
'.$excluir.'
	</td>
	<td width="10"></td>
	<td align="center">
<span class="UIButton UIButton_Large UIFormButton  UIButton_Blue" onclick="$(\'#'.$form->getName().'\').submit();">
<span class="UIIcon UIIcon_Save">&nbsp;</span>
  <input style="display: inline-block;" class="UIButton_Text" type="submit" value="Salvar" name="'.$form->getElement('submit')->getName().'_" id="'.$form->getElement('submit')->getId().'_"/>
</span>


<span class="UIButton UIButton_Large UIFormButton  UIButton_Gray" onclick="location.href = \''.$baseUrl."/".Zend_Controller_Front::getInstance()->getRequest()->getControllerName().'\'; return false;">
<span class="UIIcon UIIcon_Cancel">&nbsp;</span>
  <input style="display: inline-block;"  class="UIButton_Text" type="button" value="Cancelar" name="'.$form->getElement('cancel')->getName().'" id="'.$form->getElement('cancel')->getId().'"
  onclick="location.href = \''.$baseUrl."/".Zend_Controller_Front::getInstance()->getRequest()->getControllerName().'\'; return false;"/>
</span>

    </td>
	<td width="50"></td>
  </tr>

  <tr>
	<td height="10" colspan="5"/>
  </tr>

</table>
</form>
';
		return $output;
	}

}
